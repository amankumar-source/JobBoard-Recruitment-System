import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import axios from "axios";

import { SKILL_GAP_API_END_POINT } from "../../utils/constant";

const SkillGapAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (
                selectedFile.type === "application/pdf" ||
                selectedFile.name.endsWith(".pdf") ||
                selectedFile.name.endsWith(".doc") ||
                selectedFile.name.endsWith(".docx")
            ) {
                setFile(selectedFile);
            } else {
                toast.error("Please upload a valid PDF or DOC file.");
            }
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file || !targetRole) {
            toast.error("Please provide both a resume and a target role.");
            return;
        }

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("targetRoleName", targetRole);

        try {
            const res = await axios.post(`${SKILL_GAP_API_END_POINT}/analyze`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success("Analysis Complete!");
                setResult({
                    analysis: res.data.analysis,
                    roadmap: res.data.roadmap,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to analyze resume.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Skill Gap</span> Analyzer
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Upload your resume, tell us your dream job, and let our AI engine generate a personalized, week-by-week roadmap to get you hired.
                    </p>
                </div>

                {!result ? (
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <form onSubmit={handleAnalyze} className="space-y-6">
                            <div>
                                <Label className="text-base font-semibold block mb-2">
                                    Upload Resume (PDF/DOC)
                                </Label>
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-purple-500 hover:bg-purple-50/50 transition-all bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                                >
                                    <div className="space-y-2 text-center">
                                        <svg className="mx-auto h-12 w-12 text-purple-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 justify-center items-center">
                                            <span className="relative font-medium text-gray-900 hover:text-purple-500 p-1">
                                                Upload a file
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <div className="text-xs text-gray-500 flex flex-col items-center">
                                            {file ? <span className="font-semibold text-black mt-2">{file.name}</span> : <span>PDF, DOC up to 5MB</span>}
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <div>
                                <Label htmlFor="role" className="text-base font-semibold">Target Job Role</Label>
                                <Input
                                    id="role"
                                    type="text"
                                    placeholder="e.g. Senior Frontend Developer, Product Manager..."
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    className="mt-2 text-lg py-6 rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg text-white disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing with AI...
                                    </span>
                                ) : (
                                    "Generate My Roadmap"
                                )}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Results Section Placeholder - Will be refactored into components */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
                                <div className="flex-1 space-y-4">
                                    <h2 className="text-3xl font-bold text-gray-900 border-b pb-4">
                                        Skill Match: <span className="text-purple-600">{result.analysis.targetRoleName}</span>
                                    </h2>
                                    <p className="text-lg text-gray-700 bg-gray-50 p-4 rounded-xl border border-purple-100">
                                        {result.analysis.matchData.aiExplanation}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                            <h3 className="font-bold text-green-800 mb-3 text-lg flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Matched Skills
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {result.analysis.matchData.matchedSkills.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                            <h3 className="font-bold text-red-800 mb-3 text-lg flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                Missing Skills
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {result.analysis.matchData.missingSkills.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center relative shadow-inner">
                                    {/* Very simple progress ring placeholder */}
                                    <div
                                        className="absolute inset-0 rounded-full border-8 border-purple-500"
                                        style={{ clipPath: `polygon(0 0, 100% 0, 100% ${result.analysis.matchData.percentage}%, 0 ${result.analysis.matchData.percentage}%)` }}
                                    ></div>
                                    <span className="text-5xl font-black text-gray-800 relative z-10">{result.analysis.matchData.percentage}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Your Learning Roadmap
                                <span className="text-lg font-normal text-purple-700 ml-4 pb-1 bg-purple-100 px-3 py-1 rounded-full">{result.roadmap.estimatedCompletionWeeks} Weeks to Readiness</span>
                            </h2>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-purple-200 h-full">
                                {result.roadmap.milestones.map((milestone, idx) => (
                                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            {milestone.stepOrder}
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                            <h4 className="font-bold text-xl text-purple-900 mb-2">{milestone.focusArea}</h4>
                                            <p className="text-gray-600 mb-4">{milestone.description}</p>
                                            <div className="mb-4">
                                                <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider block mb-2">Addressing Skills:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {milestone.skillsAddressed.map((s, i) => <span key={i} className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded">{s}</span>)}
                                                </div>
                                            </div>
                                            {milestone.recommendedResources && milestone.recommendedResources.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <span className="text-sm font-semibold text-purple-800 mb-2 block">Resources</span>
                                                    <ul className="space-y-2">
                                                        {milestone.recommendedResources.map((res, i) => (
                                                            <li key={i}>
                                                                <a href={res.url !== "string" ? res.url : "#"} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                                    {res.title}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center pb-10">
                            <Button onClick={() => setResult(null)} variant="outline" className="text-purple-700 border-purple-200 hover:bg-purple-50 py-6 px-10 text-lg rounded-xl transition-all">
                                Start New Analysis
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillGapAnalyzer;
