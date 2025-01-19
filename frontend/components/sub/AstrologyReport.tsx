"use client";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../ui/Card";
import { Button as MovingBorderButton } from "../ui/MovingBorder";
import { SuggestionCard } from "./SuggessionCards";

interface AstrologyReportProps {
  summary: string;
  keyFindings: string[];
}

export enum SuggessionEnum {
  RECOMMENDED_POOJAS = "recommended-poojas",
  RECOMMENDED_GEMSTONE = "recommended-gemstone",
  RECOMMENDED_NUMEROLOGY = "numerology",
  DOS_AND_DONTS = "dos-donts",
}

export function AstrologyReport({ data }: { data: AstrologyReportProps }) {
  const [suggessionData, setSuggessionData] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = async (value: string) => {
    const payload = {
      name: value,
    };

    try {
      const response = await fetch("/api/generateFindings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      setIsLoading(true);
      const data = await response.json();

      if (response) {
        setSuggessionData(data);
        setIsLoading(false);
      } else {
        console.error("Error:", data.error || "Unknown error occurred");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full h-full">
      <div className="container mx-auto min-h-screen px-4 py-12 flex flex-col items-center justify-center gap-5">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="bg-white/5 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Overall Summary
              </h2>
              <p className="text-gray-200 leading-relaxed">{data?.summary}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Key Findings
              </h2>
              <div className="space-y-4">
                {data?.keyFindings.map((finding, index) => (
                  <MovingBorderButton
                    duration={9000}
                    borderRadius="1.75rem"
                    className="w-full text-white border-neutral-200 dark:border-slate-800"
                    key={index}
                  >
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm"
                    >
                      <p className="text-gray-200">{finding}</p>
                    </div>
                  </MovingBorderButton>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-8 lg:grid-cols-3 w-full">
          <SuggestionCard
            title="RECOMMENDED POOJAS"
            onClick={() => {
              setValue(SuggessionEnum.RECOMMENDED_POOJAS);
              handleSubmit(SuggessionEnum.RECOMMENDED_POOJAS);
            }}
          />
          <SuggestionCard
            title="RECOMMENDED GEMSTONE"
            onClick={() => {
              setValue(SuggessionEnum.RECOMMENDED_GEMSTONE);
              handleSubmit(SuggessionEnum.RECOMMENDED_GEMSTONE);
            }}
          />
          <SuggestionCard
            title="SHOW NUMEROLOGY"
            onClick={() => {
              setValue(SuggessionEnum.RECOMMENDED_NUMEROLOGY);
              handleSubmit(SuggessionEnum.RECOMMENDED_NUMEROLOGY);
            }}
          />
          {/* <SuggestionCard
            title="DO's AND DONT's"
            onClick={() => {
              setValue(SuggessionEnum.DOS_AND_DONTS);
              handleSubmit(SuggessionEnum.DOS_AND_DONTS);
            }}
          /> */}
        </div>
        {suggessionData?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggessionData?.map((item: any, index: any) => (
              <div
                key={index}
                className="p-6 bg-gray-800 rounded-lg shadow-md text-white"
              >
                <h3 className="text-xl font-bold mb-4 text-purple-400">
                  {item.name}
                </h3>
                {value === SuggessionEnum.RECOMMENDED_GEMSTONE && (
                  <>
                    <p className="mb-4">
                      <strong>Color:</strong> {item.color}
                    </p>
                    <p className="mb-4">
                      <strong>Properties:</strong> {item.properties}
                    </p>
                    <ul className="text-sm space-y-2">
                      <strong>Benefits:</strong>
                      {item.benefits.map((benefit: any, i: any) => (
                        <li key={i}>- {benefit}</li>
                      ))}
                    </ul>
                  </>
                )}
                {value === SuggessionEnum.RECOMMENDED_POOJAS && (
                  <>
                    <p className="mb-4">
                      <strong>Reason:</strong> {item.reason}
                    </p>
                    <ul className="text-sm space-y-2">
                      <strong>Benefits:</strong>
                      {item.benefits.map((benefit: any, i: any) => (
                        <li key={i}>- {benefit}</li>
                      ))}
                    </ul>
                  </>
                )}
                {value === SuggessionEnum.RECOMMENDED_NUMEROLOGY && (
                  <>
                    <p className="mb-4">
                      <strong>Number:</strong> {item.number}
                    </p>
                    <p className="mb-4">
                      <strong>Explanation:</strong> {item.explanation}
                    </p>
                  </>
                )}
                {value === SuggessionEnum.DOS_AND_DONTS && (
                  <>
                    <Card className="bg-white/5 backdrop-blur-xl border-purple-500/20">
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                          DO&apos;s
                        </h2>
                        {item.dos.map((benefit: any, i: any) => (
                          <>
                            <p className="mb-4">
                              <strong>Heading:</strong> {item.heading}
                            </p>
                            <p className="mb-4">
                              <strong>Content:</strong> {item.content}
                            </p>
                          </>
                        ))}
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border-purple-500/20">
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                          DONT&apos;s
                        </h2>
                        {item.donts.map((benefit: any, i: any) => (
                          <>
                            <p className="mb-4">
                              <strong>Heading:</strong> {item.heading}
                            </p>
                            <p className="mb-4">
                              <strong>Content:</strong> {item.content}
                            </p>
                          </>
                        ))}
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="p-3 rounded-lg max-w-xs text-sm bg-gray-800 text-gray-200 self-start flex items-center space-x-2">
            <Loader className="h-4 w-4 animate-spin" />
            <span>Analyzing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
