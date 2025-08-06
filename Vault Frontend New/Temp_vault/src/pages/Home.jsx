import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllCapsules } from "@/lib/api";
import { Lock, Unlock, Calendar, Clock } from "lucide-react";

export default function Home() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Future Vault";

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const data = await getAllCapsules();
        console.log("📋 Fetched capsules:", data.length, "items");
        setCapsules(data);
      } catch (error) {
        console.error("❌ Error fetching capsules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 150); // typing speed

    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const lockedCapsules = capsules.filter(
    (capsule) => new Date(capsule.unlock_at) > now
  );
  const unlockedCapsules = capsules.filter(
    (capsule) => new Date(capsule.unlock_at) <= now
  );

  console.log(
    `🔒 ${lockedCapsules.length} locked, 🔓 ${unlockedCapsules.length} unlocked capsules`
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#0d0d25] to-[#1001f]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-white/5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-20 z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          {/* Floating icon with enhanced glow effect */}
          <div className="inline-block p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl mb-20 relative group">
            {/* Multi-layered glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-cyan-400/20 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
            <svg
              className="w-16 h-16 text-white relative z-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>

          <h1
            className="text-8xl sm:text-7xl lg:text-8xl font-bold mb-12 font-sans bg-clip-text text-transparent leading-tight relative min-h-[6rem]"
            style={{
              backgroundImage: `
                linear-gradient(
                  to top,
                  #2e4f80 0%,
                  #5e9be3 20%,
                  #8bc1f5 35%,
                  #c8e5fc 50%,
                  #eff7f6 65%,
                  #ffffff 90%
                )
              `,
            }}
          >
            <span className="inline-block">{displayedText}</span>
            {displayedText.length < fullText.length && (
              <span className="absolute bottom-2 w-[6px] h-24 bg-white ml-1"></span>
            )}
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Lock your thoughts, memories, and wishes in a digital time capsule
            that unlocks at your chosen future date
          </p>

          {/* Enhanced Stats with glassmorphism and glow */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/10 shadow-xl relative group">
              {/* Amber glow for locked capsules */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/10 via-yellow-400/10 to-orange-400/10 rounded-2xl blur-md opacity-15 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-3 h-3 bg-amber-400/70 rounded-full animate-pulse"></div>
                <span className="text-gray-200 font-semibold text-lg">
                  {lockedCapsules.length} Locked Capsule
                  {lockedCapsules.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/10 shadow-xl relative group">
              {/* Emerald glow for unlocked capsules */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/10 via-green-400/10 to-teal-400/10 rounded-2xl blur-md opacity-15 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-3 h-3 bg-emerald-400/70 rounded-full animate-pulse delay-500"></div>
                <span className="text-gray-200 font-semibold text-lg">
                  {unlockedCapsules.length} Unlocked Capsule
                  {unlockedCapsules.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/create"
              className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-semibold text-white bg-gradient-to-r from-slate-700 via-gray-700 to-slate-700 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 hover:from-slate-600 hover:via-gray-600 hover:to-slate-600"
            >
              {/* Enhanced multi-layer glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center group-hover:text-blue-100 transition-colors duration-300">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Time Capsule
              </span>
            </Link>

            <Link
              to="/capsules"
              className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-semibold text-gray-200 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:bg-white/10 transform hover:scale-105 hover:-translate-y-1"
            >
              {/* Blue/purple glow for view capsules button */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center group-hover:text-white transition-colors duration-300">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                View All Capsules ({capsules.length})
              </span>
            </Link>
          </div>
        </div>

        {/* Recently Created Capsules */}
        {capsules.length > 0 && (
          <div className="mt-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
              Recently Created Capsules
            </h2>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
              {capsules.slice(0, 3).map((capsule, index) => {
                const isUnlocked =
                  new Date(capsule.unlock_at) <= new Date() ||
                  capsule.is_unlocked;
                return (
                  <Link
                    key={capsule.public_id}
                    to={`/capsule/${capsule.public_id}`}
                    className="flex-1 block group"
                  >
                    <div
                      className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10 transition-all duration-500 hover:shadow-2xl transform translate-y-10 opacity-0 animate-[slideUp_0.5s_ease-out_forwards] hover:z-10"
                      style={{
                        animationDelay: `${index * 0.15}s`,
                        // Add perspective for 3D effect
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Enhanced hover effect layers */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Depth effect elements */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                        style={{
                          background:
                            "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
                          transform: "translateZ(20px)",
                          filter: "blur(1px)",
                        }}
                      ></div>

                      <div className="relative z-10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-transform duration-500">
                        {/* Header with title and status */}
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-semibold text-blue-200 leading-tight flex-1 pr-2 group-hover:text-white transition-colors duration-300">
                            {capsule.title}
                          </h3>
                          <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                            {isUnlocked ? (
                              <Unlock className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                            ) : (
                              <Lock className="h-5 w-5 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />
                            )}
                          </div>
                        </div>

                        {/* Author */}
                        <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-colors duration-300">
                          By {capsule.name}
                        </p>

                        {/* Message preview */}
                        <div className="text-sm text-gray-300 mb-6 leading-relaxed min-h-[3rem] group-hover:text-gray-100 transition-colors duration-300">
                          {isUnlocked && !capsule.message.startsWith("🔒") ? (
                            <p className="line-clamp-3">
                              {capsule.message.length > 120
                                ? `${capsule.message.substring(0, 120)}...`
                                : capsule.message}
                            </p>
                          ) : (
                            <div className="flex items-center text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
                              <Lock className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm italic">
                                Message will be revealed on{" "}
                                {new Date(
                                  capsule.unlock_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Footer with dates and status */}
                        <div className="space-y-3 pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                              <Calendar className="h-3 w-3 mr-1" />
                              Created:{" "}
                              {capsule.created_at
                                ? new Date(
                                    capsule.created_at
                                  ).toLocaleDateString()
                                : "Unknown"}
                            </div>

                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full border transition-all duration-300 ${
                                isUnlocked
                                  ? "text-green-400 bg-green-900/20 border-green-700/30 group-hover:bg-green-900/30 group-hover:border-green-700/50 group-hover:text-green-300"
                                  : "text-amber-400 bg-amber-900/20 border-amber-700/30 group-hover:bg-amber-900/30 group-hover:border-amber-700/50 group-hover:text-amber-300"
                              }`}
                            >
                              {isUnlocked ? "Unlocked" : "Locked"}
                            </span>
                          </div>

                          <div className="flex items-center text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>
                              {isUnlocked
                                ? `Unlocked: ${new Date(
                                    capsule.unlock_at
                                  ).toLocaleDateString()}`
                                : `Unlocks: ${new Date(
                                    capsule.unlock_at
                                  ).toLocaleDateString()}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shadow effect on hover */}
                      <div
                        className="absolute -bottom-2 left-4 right-4 h-4 rounded-b-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          filter: "blur(8px)",
                          transform: "translateZ(-10px) scale(0.95)",
                        }}
                      ></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none"></div>

      <style jsx>{`
        @keyframes slideUp {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
