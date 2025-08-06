import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Calendar, Lock, Unlock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAllCapsules } from "@/lib/api";

export default function Capsules() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const data = await getAllCapsules();
        console.log("📋 Fetched capsules for capsules page:", data.length, "items");
        setCapsules(data);
      } catch (error) {
        console.error("❌ Error fetching capsules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b0e14] to-[#111827]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-16 bg-gradient-to-br from-black via-[#0b0e14] to-[#111827] text-white">
      {/* Home Button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Home
        </Link>
      </div>

      <h1
        className="text-4xl font-bold mb-16 text-center bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(
            to top,
            #2e4f80 0%,
            #5e9be3 20%,
            #8bc1f5 35%,
            #c8e5fc 50%,
            #eff7f6 65%,
            #ffffff 90%
          )`,
        }}
      >
        Time Capsules
      </h1>

      {capsules.length === 0 ? (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="relative mx-auto w-fit mb-6">
            <div className="absolute -inset-1 rounded-full bg-blue-900/30 blur-lg"></div>
            <div className="relative rounded-full bg-[#0f172a] p-4 shadow-md">
              <Clock className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-medium mb-3">No Capsules Available</h2>
          <p className="text-gray-400">
            There are no time capsules available at the moment.
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {capsules.map((capsule) => {
            // Frontend double-check of unlock status
            const isUnlocked = new Date(capsule.unlock_at) <= new Date() || capsule.is_unlocked;
            console.log(`Capsule ${capsule.public_id}: isUnlocked=${isUnlocked}, message preview="${capsule.message.substring(0, 30)}..."`);
            
            return (
              <Link key={capsule.public_id} to={`/capsule/${capsule.public_id}`}>
                <Card className="bg-gradient-to-br from-[#0e0e0e] to-[#1a1a1a] border border-blue-900/30 rounded-2xl shadow-lg hover:shadow-blue-700/30 hover:ring-1 hover:ring-blue-600/40 transition duration-200 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-transparent rounded-2xl pointer-events-none"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-blue-200 leading-tight flex-1 pr-2">
                        {capsule.title}
                      </h3>
                      <div className="flex-shrink-0">
                        {isUnlocked ? (
                          <Unlock className="h-4 w-4 text-green-400" />
                        ) : (
                          <Lock className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>

                    {/* Message preview - Only show for unlocked capsules */}
                    <div className="text-sm text-gray-300 mb-4 leading-relaxed min-h-[2.5rem]">
                      {isUnlocked && !capsule.message.startsWith('🔒') ? (
                        // Show actual message preview for unlocked capsules
                        <p className="line-clamp-2">
                          {capsule.message.length > 80 
                            ? `${capsule.message.substring(0, 80)}...` 
                            : capsule.message
                          }
                        </p>
                      ) : (
                        // Show locked indicator for locked capsules
                        <div className="flex items-center text-amber-400">
                          <Lock className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="text-xs italic">
                            Message locked until {new Date(capsule.unlock_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-800/50">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {capsule.created_at 
                          ? new Date(capsule.created_at).toLocaleDateString()
                          : new Date(capsule.unlock_at).toLocaleDateString()
                        }
                      </div>

                      <div className="flex items-center">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full border ${
                            isUnlocked
                              ? "text-green-400 bg-green-900/20 border-green-700/30"
                              : "text-red-400 bg-red-900/20 border-red-700/30"
                          }`}
                        >
                          {isUnlocked ? "Unlocked" : "Locked"}
                        </span>
                      </div>
                    </div>

                    {/* Unlock date info */}
                    <div className="mt-2 pt-2 border-t border-gray-800/30">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>
                          {isUnlocked 
                            ? `Unlocked on ${new Date(capsule.unlock_at).toLocaleDateString()}`
                            : `Unlocks on ${new Date(capsule.unlock_at).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}