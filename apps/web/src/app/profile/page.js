"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Brain, Activity, Target, ShieldCheck, Trophy, Settings, Bell, Lock, User, Save, X, KeyRound, CheckCircle2 } from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [isManagingNotifications, setIsManagingNotifications] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const user = session?.user;
  const email = user?.email || "user@example.com";
  const name = user?.name || email.split('@')[0] || "Explorer";

  const handleEditProfile = () => {
    setEditName(name);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        await update({ name: editName });
        setIsEditing(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (e) {
      alert("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setPasswordSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => {
          setIsChangingPassword(false);
          setPasswordSuccess("");
        }, 3000);
      } else {
        setPasswordError(data.error || "Failed to update password.");
      }
    } catch (e) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setIsSavingNotifications(true);
    setNotificationSuccess("");
    
    // Simulate API call
    setTimeout(() => {
      setIsSavingNotifications(false);
      setNotificationSuccess("Preferences saved successfully!");
      setTimeout(() => {
        setIsManagingNotifications(false);
        setNotificationSuccess("");
      }, 2000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-2xl relative overflow-hidden">
          {/* Decorative Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-100 pb-10">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary-500 to-teal-400 p-1 shadow-xl shrink-0">
                <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center relative">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="User Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1 min-w-0">
                {isEditing ? (
                  <div className="mb-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={isSaving}
                      className="text-3xl sm:text-4xl font-black text-gray-900 border-b-2 border-primary-500 focus:outline-none focus:border-primary-600 bg-transparent w-full"
                      placeholder="Your Name"
                      autoFocus
                    />
                  </div>
                ) : (
                  <h1 className="text-4xl font-black text-gray-900 mb-2 truncate">{name}</h1>
                )}
                <p className="text-lg font-medium text-gray-500 flex items-center justify-center md:justify-start gap-2 truncate">
                  <Mail className="w-5 h-5 shrink-0" /> <span className="truncate">{email}</span>
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm shadow-sm border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Premium Member
                </div>
              </div>
              
              <div className="md:ml-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors w-full sm:w-auto disabled:opacity-50"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-colors w-full sm:w-auto disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save"}
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEditProfile}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-50 text-primary-600 font-bold hover:bg-primary-100 transition-colors border border-primary-100 w-full sm:w-auto"
                  >
                    <User className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-gray-100">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <Activity className="w-8 h-8 text-primary-500 mb-3" />
                <span className="text-3xl font-black text-gray-900 mb-1">12</span>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Sessions</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mb-3" />
                <span className="text-3xl font-black text-gray-900 mb-1">450</span>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Brain Points</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <Target className="w-8 h-8 text-emerald-500 mb-3" />
                <span className="text-3xl font-black text-gray-900 mb-1">85%</span>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Accuracy</span>
              </div>
            </div>

            <div className="pt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-gray-500" /> Account Settings
              </h2>
              
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden transition-all duration-300">
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-500">Manage email and push alerts</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsManagingNotifications(!isManagingNotifications)}
                      className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition-colors"
                    >
                      {isManagingNotifications ? "Close" : "Manage"}
                    </button>
                  </div>

                  {isManagingNotifications && (
                    <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
                      <form onSubmit={handleSaveNotifications} className="space-y-4 max-w-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">Email Alerts</p>
                            <p className="text-sm text-gray-500">Receive important updates via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-500">Get alerts directly on your device</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={pushAlerts} onChange={() => setPushAlerts(!pushAlerts)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">Weekly Reports</p>
                            <p className="text-sm text-gray-500">Get a summary of your brain training</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={weeklyReports} onChange={() => setWeeklyReports(!weeklyReports)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                          </label>
                        </div>

                        {notificationSuccess && (
                          <div className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> {notificationSuccess}
                          </div>
                        )}

                        <div className="pt-4">
                          <button 
                            type="submit"
                            disabled={isSavingNotifications}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isSavingNotifications ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              "Save Preferences"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden transition-all duration-300">
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Privacy & Security</h3>
                        <p className="text-sm text-gray-500">Update password and privacy preferences</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setIsChangingPassword(!isChangingPassword);
                        setPasswordError("");
                        setPasswordSuccess("");
                      }}
                      className="text-sm font-bold text-orange-600 hover:text-orange-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition-colors shrink-0"
                    >
                      {isChangingPassword ? "Close" : "Manage"}
                    </button>
                  </div>

                  {isChangingPassword && (
                    <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <KeyRound className="w-5 h-5 text-gray-400" /> Change Password
                      </h4>
                      
                      <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <input 
                            type="password" 
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                            placeholder="Enter current password"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input 
                            type="password" 
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                            placeholder="Enter new password (min 8 chars)"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input 
                            type="password" 
                            required
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                            placeholder="Confirm new password"
                          />
                        </div>

                        {passwordError && (
                          <div className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                            {passwordError}
                          </div>
                        )}
                        
                        {passwordSuccess && (
                          <div className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> {passwordSuccess}
                          </div>
                        )}

                        <div className="pt-2">
                          <button 
                            type="submit"
                            disabled={isUpdatingPassword}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isUpdatingPassword ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              "Update Password"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
