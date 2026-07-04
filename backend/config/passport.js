const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

console.log('🔐 تهيئة استراتيجية Google...');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('📝 استلام بيانات من Google:', profile.id);
      
      // البحث عن مستخدم موجود
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        console.log('✅ مستخدم موجود:', user.email);
        return done(null, user);
      }

      // البحث بالبريد الإلكتروني
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email: email });
        if (user) {
          console.log('✅ ربط حساب Google بحساب موجود:', email);
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }
      }

      // إنشاء مستخدم جديد
      console.log('🆕 إنشاء مستخدم جديد:', email);
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        googleId: profile.id,
        name: profile.displayName || 'مستخدم Google',
        email: email,
        password: hashedPassword,
        phone: '',
        isActive: true,
      });

      await user.save();
      console.log('✅ تم إنشاء المستخدم بنجاح');
      return done(null, user);

    } catch (error) {
      console.error('❌ خطأ:', error.message);
      return done(error, null);
    }
  }
));

console.log('✅ استراتيجية Google جاهزة');

module.exports = passport;