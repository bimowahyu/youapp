import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProfileDocument = Profile & Document & {
    checkProfileComplete: () => boolean;
  };

@Schema({
  timestamps: true,
  collection: 'profiles'
})
export class Profile {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 50
  })
  name: string;

  @Prop({
    required: true,
    type: Date
  })
  birthday: Date;

  @Prop({
    required: true,
    type: Number,
    min: 0,
    max: 300 // in cm
  })
  height: number;

  @Prop({
    required: true,
    type: Number,
    min: 0,
    max: 500 // in kg
  })
  weight: number;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: function(interests: string[]) {
        return interests.length <= 10; // Maximum 10 interests
      },
      message: 'Maximum 10 interests allowed'
    }
  })
  interests: string[];

  @Prop({
    type: String,
    required: false,
    enum: [
      'Aries', 'Taurus', 'Gemini', 'Cancer',
      'Leo', 'Virgo', 'Libra', 'Scorpio',
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
  })
  horoscope: string;

  @Prop({
    type: String,
    required: false,
    enum: [
      'Rat', 'Ox', 'Tiger', 'Rabbit',
      'Dragon', 'Snake', 'Horse', 'Goat',
      'Monkey', 'Rooster', 'Dog', 'Pig'
    ]
  })
  zodiac: string;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: function(photos: string[]) {
        return photos.length <= 5; // Maximum 5 photos
      },
      message: 'Maximum 5 photos allowed'
    }
  })
  photos: string[];

  @Prop({
    required: true,
    type: String,
    enum: ['male', 'female', 'other']
  })
  gender: string;

  @Prop({
    type: String,
    maxlength: 500,
    trim: true
  })
  bio?: string;

  @Prop({
    type: String,
    trim: true
  })
  location?: string;

  @Prop({
    type: Boolean,
    default: false
  })
  isProfileComplete: boolean;

  @Prop({
    type: Date,
    default: null
  })
  lastActive?: Date;
}

const ProfileSchema = SchemaFactory.createForClass(Profile);

// Add indexes for common queries
ProfileSchema.index({ name: 'text' });
ProfileSchema.index({ 'location': 1 });
ProfileSchema.index({ birthday: 1 });

// Virtual for age calculation
ProfileSchema.virtual('age').get(function() {
  const today = new Date();
  const birthDate = this.birthday;
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Method to check if profile is complete
ProfileSchema.methods.checkProfileComplete = function(): boolean {
  const requiredFields = ['name', 'birthday', 'height', 'weight', 'gender'];
  return requiredFields.every(field => this[field] != null);
};

ProfileSchema.pre<ProfileDocument>('save', function(next) {
    this.isProfileComplete = this.checkProfileComplete();
    next();
  });
  
export { ProfileSchema };