import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings as SettingsIcon, User, Lock, Camera, Image, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

const accountSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6, 'Old password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

type AccountForm = z.infer<typeof accountSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export const Settings: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const {
    register: registerAccount,
    handleSubmit: handleSubmitAccount,
    formState: { errors: accountErrors },
  } = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateAccount = async (data: AccountForm) => {
    setIsUpdatingAccount(true);
    try {
      const res = await authService.updateAccount(data);
      if (res.success && res.data) {
        setUser(res.data);
        toast.success('Account details updated successfully');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update account details');
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    setIsChangingPassword(true);
    try {
      const res = await authService.changePassword(data);
      if (res.success) {
        toast.success('Password changed successfully');
        resetPassword();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setIsUploadingMedia(true);
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const res = await authService.updateAvatar(formData);
      if (res.success && res.data) {
        setUser(res.data);
        toast.success('Avatar updated successfully');
        setAvatarFile(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update avatar');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleUploadCover = async () => {
    if (!coverFile) return;
    setIsUploadingMedia(true);
    const formData = new FormData();
    formData.append('coverImage', coverFile);

    try {
      const res = await authService.updateCoverImage(formData);
      if (res.success && res.data) {
        setUser(res.data);
        toast.success('Cover image updated successfully');
        setCoverFile(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update cover image');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-purple-400" />
          Account Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage your channel details, avatar, and security</p>
      </div>

      {/* Channel Branding & Media */}
      <section className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col gap-6">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Camera className="w-4 h-4 text-purple-400" />
          Channel Branding
        </h2>

        {/* Avatar Upload */}
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} name={user?.fullName || user?.username} size="xl" />
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-semibold text-slate-300">Profile Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
            />
            {avatarFile && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleUploadAvatar}
                isLoading={isUploadingMedia}
                className="self-start mt-1"
              >
                Upload Avatar
              </Button>
            )}
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="flex flex-col gap-2 pt-4 border-t border-slate-800/80">
          <label className="text-xs font-semibold text-slate-300">Cover Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
          />
          {coverFile && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUploadCover}
              isLoading={isUploadingMedia}
              className="self-start mt-1"
            >
              Upload Cover Banner
            </Button>
          )}
        </div>
      </section>

      {/* Update Account Details */}
      <section className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col gap-5">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-sky-400" />
          Personal Information
        </h2>

        <form onSubmit={handleSubmitAccount(onUpdateAccount)} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            error={accountErrors.fullName?.message}
            {...registerAccount('fullName')}
          />
          <Input
            label="Email Address"
            type="email"
            error={accountErrors.email?.message}
            {...registerAccount('email')}
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isUpdatingAccount}
            className="self-start"
          >
            Save Account Details
          </Button>
        </form>
      </section>

      {/* Change Password */}
      <section className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col gap-5">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-rose-400" />
          Security & Password
        </h2>

        <form onSubmit={handleSubmitPassword(onChangePassword)} className="flex flex-col gap-4">
          <Input
            label="Current Password"
            type="password"
            error={passwordErrors.oldPassword?.message}
            {...registerPassword('oldPassword')}
          />
          <Input
            label="New Password"
            type="password"
            error={passwordErrors.newPassword?.message}
            {...registerPassword('newPassword')}
          />

          <Button
            type="submit"
            variant="secondary"
            size="sm"
            isLoading={isChangingPassword}
            className="self-start"
          >
            Change Password
          </Button>
        </form>
      </section>
    </div>
  );
};
