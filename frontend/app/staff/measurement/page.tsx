"use client";
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { toast } from "sonner";
import { Camera, Upload, RefreshCw, CheckCircle, AlertTriangle, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment" // Use back camera on mobile
};

export default function WallMeasurementPage() {
    const webcamRef = useRef<Webcam>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<{
        area_m2: number;
        cleaning_cost: number;
        confidence_score: number;
        wall_area_pixels: number;
        currency?: string;
    } | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImageSrc(imageSrc);
            // Convert base64 to blob for upload if needed later
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    setFile(file);
                });
        }
    }, [webcamRef]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validate file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error("File size exceeds 10MB limit.");
                return;
            }

            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImageSrc(e.target.result as string);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const analyzeImage = async () => {
        if (!file) {
            toast.error("Please capture or upload an image first.");
            return;
        }

        setAnalyzing(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            // Try to get token from localStorage or cookie
            let token = localStorage.getItem("token");

            // If not in localStorage, try to parse from cookie (as fallback)
            if (!token && typeof document !== "undefined") {
                const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
                if (match) token = match[2];
            }

            const headers: Record<string, string> = {
                "Content-Type": "multipart/form-data",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/analyze-wall`,
                formData,
                {
                    withCredentials: true,
                    headers
                }
            );

            if (response.data.success) {
                setResult(response.data.data);
                toast.success("Analysis complete!");
            } else {
                toast.error("Analysis failed. Please try again.");
            }
        } catch (error: any) {
            console.error("Analysis error:", error);
            if (error.response) {
                console.error("Error status:", error.response.status);
                console.error("Error data:", error.response.data);
                toast.error(`Error ${error.response.status}: ${error.response.data?.error || "Failed to analyze image."}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("Network error: No response from server. Please check your connection.");
            } else {
                console.error("Error setting up request:", error.message);
                toast.error(`Error: ${error.message}`);
            }
        } finally {
            setAnalyzing(false);
        }
    };

    const reset = () => {
        setImageSrc(null);
        setResult(null);
        setFile(null);
    };

    return (
        <div className="container max-w-lg mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Ruler className="h-6 w-6 text-primary" />
                        Wall Measurement
                    </h1>
                    <p className="text-muted-foreground">AI-powered area calculation</p>
                </div>
                <Button variant="outline" size="sm" onClick={reset} disabled={!imageSrc}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                </Button>
            </div>

            <Card className="overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-800">
                <CardContent className="p-0 relative bg-black/5 min-h-[300px] flex items-center justify-center">
                    {!imageSrc ? (
                        <div className="w-full h-full min-h-[400px] relative">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 border-2 border-white/50 rounded-lg"></div>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4 pb-4">
                                <Button onClick={capture} size="lg" className="rounded-full h-16 w-16 p-0 border-4 border-white/30 bg-primary hover:bg-primary/90">
                                    <Camera className="h-8 w-8" />
                                </Button>
                                <div className="absolute right-6 bottom-6">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="file-upload"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="file-upload">
                                        <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 cursor-pointer" asChild>
                                            <span><Upload className="h-5 w-5" /></span>
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageSrc} alt="Captured wall" className="w-full h-auto" />
                            {result && (
                                <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top-4">
                                    <Badge variant="secondary" className="text-lg py-1 px-3 shadow-lg bg-white/90 text-black backdrop-blur-sm">
                                        {result.confidence_score > 0.7 ? (
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 inline" />
                                        ) : (
                                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 inline" />
                                        )}
                                        {Math.round(result.confidence_score * 100)}% Conf
                                    </Badge>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {imageSrc && !result && (
                <Button className="w-full" size="lg" onClick={analyzeImage} disabled={analyzing}>
                    {analyzing ? (
                        <>Analyzing...</>
                    ) : (
                        <>Analyze Wall Area</>
                    )}
                </Button>
            )}

            {result && (
                <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Estimated Area</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-primary">
                                {result.area_m2} <span className="text-xl text-muted-foreground">m²</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Based on {result.wall_area_pixels.toLocaleString()} detected pixels
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Calculated Cost</CardTitle>
                            <CardDescription>Estimated cleaning price</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {result.currency === 'USD' ? '$' : ''}{result.cleaning_cost} {result.currency !== 'USD' ? result.currency : ''}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                At standard rate
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
