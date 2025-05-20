import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../../utils/sendEmail.js';
import * as securePin from 'secure-pin';
import cryptoNode from 'node:crypto';

export const UserStatus = {
    UNCONFIRMED: 'UNCONFIRMED',
    ACTIVE: 'ACTIVE',
    DELETED: 'DELETED',
    SUSPENDED: 'SUSPENDED',
}


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    gender: String,
    date_of_birth: String,
    fullname: String,
    password: {
        type: String,
        select: false,
    },
    phone_number: String,
    contact_address: String,
    next_of_kin: {
      fullname: String,
      phone_number: String,
      contact_address: String,
      contact_email: String,
    },
    auth_token: String,
    auth_expiry: Date,
    auth_otp: String,
    status: {
        type: String,
        default: UserStatus.UNCONFIRMED,
    },

    reason_for_inactive: String,
    hotel: [{
        type: mongoose.Types.ObjectId,
        ref: 'Hotel',
        required: false,
    }],
    bookings: [{
        type: mongoose.Types.ObjectId,
        ref: 'Booking',
        required: false,
    }],
    is_admin: {
      type: Boolean,
      default: false,
    }

  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  this.updatedAt = new Date();
})

userSchema.methods.checkDuplicate = async function() {
  const existed = await mongoose.models.User.findOne({email: this.email}).exec();
  if(existed) {
    let error = new Error("Account already existed, please login!");
    error['status'] = 409;
    throw error;
  }
}


userSchema.methods.generateCredentials = async function(){
  
  const otp = securePin.generatePinSync(6);

  const token = cryptoNode.randomBytes(24).toString("hex");

  const expiry = new Date(Date.now() + 1000 * 5 * 60)

  return {otp, expiry, token};
}


userSchema.methods.hashPassword = async function() {
  this.password = bcrypt.hashSync(this.password);
}


userSchema.methods.sendConfirmationEmail = async function(otp, token_expiry, token){
  const email = this.email;
  const link = `${process.env.CLIENT_URL}/auth/verify?token=${token}`;

  sendEmail(email,  "Security Notification", "auth_notifier", {
    otp,
    token_expiry: 5,
    link,
    name: this.fullname ?? 'User'
  })
}
userSchema.methods.comparePassword = async function(password) {
  if(this.password && password) {
    return await bcrypt.compareSync(password, this.password);
  }
  return false;
}

userSchema.methods.signJwt = async function() {
  const credentials = {
    id: this._id,
  };
  return await jwt.sign(credentials, process.env.JWT_SECRET, {expiresIn: `${process.env.JWT_EXPIRES}`})
}
export const UserModel = mongoose.model("User", userSchema);
