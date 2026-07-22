import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const payload = data.usernameOrEmail.includes('@')
      ? { email: data.usernameOrEmail, password: data.password }
      : { username: data.usernameOrEmail, password: data.password };

    try {
      const res = await authService.login(payload);
      if (res.success && res.data) {
        setUser(res.data.user);
        toast.success('Welcome back to Yitter!');
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-100">Welcome Back</h1>
        <p className="text-xs text-slate-400 mt-1">Sign in to your Yitter account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Username or Email"
          placeholder="e.g. john@example.com or johndoe"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.usernameOrEmail?.message}
          {...register('usernameOrEmail')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          isLoading={isLoading}
          leftIcon={<LogIn className="w-4 h-4" />}
          className="mt-2"
        >
          Sign In
        </Button>
      </form>

      <p className="text-xs text-center text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-purple-400 font-bold hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
};
