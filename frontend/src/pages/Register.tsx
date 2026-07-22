import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, User, Mail, Lock, Camera, Image } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (!avatarFile) {
      toast.error('Avatar image is required');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('avatar', avatarFile);
    if (coverFile) {
      formData.append('coverImage', coverFile);
    }

    try {
      const res = await authService.register(formData);
      if (res.success) {
        toast.success('Account registered successfully! Please log in.');
        navigate('/login');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-100">Create Account</h1>
        <p className="text-xs text-slate-400 mt-1">Join Yitter community today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Username"
          placeholder="johndoe"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Avatar Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Avatar Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
          />
        </div>

        {/* Cover Image Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Cover Banner (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
          />
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          isLoading={isLoading}
          leftIcon={<UserPlus className="w-4 h-4" />}
          className="mt-2"
        >
          Create Account
        </Button>
      </form>

      <p className="text-xs text-center text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-purple-400 font-bold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};
