"use client";

import { useEffect, useRef, useState } from "react";
import { AstrologyReport } from "../sub/AstrologyReport";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { Input } from "../ui/Input";
import { Label } from "../ui/Lable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Loader } from "lucide-react";

interface AstrologyReportProps {
  summary: string;
  keyFindings: string[];
}

export default function AstrologyForm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);


  const [data, setData] = useState<AstrologyReportProps>();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState({
    day: "",
    month: "",
    year: "",
    time: "",
  });
  const [unknownTime, setUnknownTime] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Slow down the video
    }
  }, []);

  const handleSubmit = async () => {
    // Format date of birth as "DD-MM-YYYY"
    setIsLoading(true)
    const dob = `${date.day}-${date.month}-${date.year}`;

    // Build the payload
    const payload = {
      name,
      dob,
      birthTime: unknownTime ? "Unknown" : date.time,
      city,
    };

    try {
      // Make a POST request to the API
      const response = await fetch("/api/astrology", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setData(data);
        setIsLoading(false)
      } else {
        console.error("Error:", data.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Network error:", error);
      setIsLoading(false)
    }
  };

  return (
    <div className="w-full h-full">
      {data ? (
        <AstrologyReport data={data} />
      ) : (
        <div className="container mx-auto min-h-screen px-4 py-12 flex items-center justify-center">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Right Column - Form */}
            <div className="relative">
              <div className="space-y-8 rounded-[2rem] bg-white/5 p-8 backdrop-blur-xl">
                {/* Name Section */}
                <div className="relative">
                  <Label className="text-2xl font-bold text-white">
                    Discover Your Cosmic Journey
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-4 border-0 bg-white/10 px-6 py-6 text-lg text-white 
                           placeholder:text-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Birth Details Section */}
                <div className="space-y-4">
                  <Label className="text-xl font-bold text-white">
                    Your Celestial Timing
                  </Label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Select
                      onValueChange={(value) =>
                        setDate((prev) => ({ ...prev, day: value }))
                      }
                    >
                      <SelectTrigger
                        className="border-0 bg-white/10 px-6 py-6 text-white 
                               focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      >
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1025] text-white">
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      onValueChange={(value) =>
                        setDate((prev) => ({ ...prev, month: value }))
                      }
                    >
                      <SelectTrigger
                        className="border-0 bg-white/10 px-6 py-6 text-white 
                               focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      >
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1025] text-white">
                        {[
                          "01",
                          "02",
                          "03",
                          "04",
                          "05",
                          "06",
                          "07",
                          "08",
                          "09",
                          "10",
                          "11",
                          "12",
                        ].map((month, index) => (
                          <SelectItem key={index} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      onValueChange={(value) =>
                        setDate((prev) => ({ ...prev, year: value }))
                      }
                    >
                      <SelectTrigger
                        className="border-0 bg-white/10 px-6 py-6 text-white 
                               focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      >
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1025] text-white">
                        {Array.from({ length: 100 }, (_, i) => (
                          <SelectItem key={i} value={(2024 - i).toString()}>
                            {2024 - i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="relative">
                      <Input
                        type="time"
                        value={date.time}
                        onChange={(e) =>
                          setDate((prev) => ({ ...prev, time: e.target.value }))
                        }
                        className="border-0 bg-white/10 px-6 py-6 text-white 
                               focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                        disabled={unknownTime}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unknown-time"
                      className="h-5 w-5 border-purple-500 data-[state=checked]:bg-purple-500"
                      onCheckedChange={(checked: any) =>
                        setUnknownTime(checked)
                      }
                    />
                    <Label
                      htmlFor="unknown-time"
                      className="text-sm text-purple-200"
                    >
                      I don&apos;t know my time of birth
                    </Label>
                  </div>
                </div>

                {/* Location Section */}
                <div className="space-y-4">
                  <Label className="text-xl font-bold text-white">
                    Your Earthly Origins
                  </Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select onValueChange={(value) => setCity(value)}>
                      <SelectTrigger
                        className="border-0 bg-white/10 px-6 py-6 text-white 
             focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      >
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1025] text-white">
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="Kolkata">Kolkata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="relative w-full overflow-hidden rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 
                         px-8 py-6 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg 
                         hover:shadow-purple-500/50"
                  onClick={handleSubmit}
                >
                  <span className="relative z-10">Reveal Your Cosmic Path</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 opacity-0 transition-opacity hover:opacity-100" />
                </Button>
              </div>
            </div>
            {/* Left Column - Image */}
            <div className="relative hidden lg:block h-full">
              <div className="sticky top-10">
                <video
                  autoPlay
                  muted
                  loop
                  className="rounded-3xl"
                  ref={videoRef}
                >
                  <source src="/videos/bg_video.webm" type="video/webm" />
                </video>
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-[#0a061d] via-transparent to-transparent" />
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center">
                <div className="p-3 rounded-lg max-w-xs text-sm bg-gray-800 text-gray-200 self-start flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
