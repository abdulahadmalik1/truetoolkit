"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, Select, ResultCard } from "@/components/ui";

const PROJECT_LICENSES = [
  { value: "proprietary", label: "Proprietary / Closed Source (Commercial)" },
  { value: "mit", label: "MIT / Permissive Open Source" },
  { value: "gpl", label: "GPLv3 / Strong Copyleft Open Source" }
];

const DEP_LICENSES = [
  { value: "mit", label: "MIT" },
  { value: "apache", label: "Apache 2.0" },
  { value: "bsd", label: "BSD 2/3-Clause" },
  { value: "lgpl", label: "LGPL (Lesser General Public License)" },
  { value: "gpl", label: "GPL (v2 or v3)" },
  { value: "agpl", label: "AGPL (Affero GPL)" },
];

type Dependency = { id: string; name: string; license: string };

export default function LicenseConflictChecker() {
  const [projectLicense, setProjectLicense] = useState("proprietary");
  const [deps, setDeps] = useState<Dependency[]>([
    { id: "1", name: "react", license: "mit" },
    { id: "2", name: "ffmpeg-core", license: "gpl" },
    { id: "3", name: "lodash", license: "mit" },
  ]);

  const addDep = () => setDeps([...deps, { id: Math.random().toString(), name: "new-package", license: "mit" }]);
  const updateDep = (id: string, key: keyof Dependency, val: string) => setDeps(deps.map(d => d.id === id ? { ...d, [key]: val } : d));
  const removeDep = (id: string) => setDeps(deps.filter(d => d.id !== id));

  const conflicts = useMemo(() => {
    const issues: { depName: string, license: string, severity: "CRITICAL" | "WARNING" | "OK", message: string }[] = [];
    let hasCritical = false;

    deps.forEach(dep => {
      let severity: "CRITICAL" | "WARNING" | "OK" = "OK";
      let message = "Permissive license. Safe to use.";

      if (projectLicense === "proprietary") {
        if (dep.license === "gpl") {
          severity = "CRITICAL";
          message = "GPL is a strong copyleft license. If you include this in your project, your entire proprietary codebase MUST be open-sourced under the GPL. Remove this dependency or switch to an open-source model.";
        } else if (dep.license === "agpl") {
          severity = "CRITICAL";
          message = "AGPL is extremely strict. Even if you don't distribute your app (e.g. it's a cloud SaaS), using this requires open-sourcing your entire server codebase. Remove immediately if closed-source.";
        } else if (dep.license === "lgpl") {
          severity = "WARNING";
          message = "LGPL can be used in closed-source apps ONLY if you dynamically link the library. If you statically link it (or bundle it in a way the user can't swap it out), you must open-source your code.";
        } else if (dep.license === "apache") {
          message = "Permissive and safe for commercial use. Note: Requires preserving copyright notices and contains explicit patent grant clauses.";
        }
      } else if (projectLicense === "mit") {
        if (dep.license === "gpl" || dep.license === "agpl") {
          severity = "CRITICAL";
          message = "You cannot re-license GPL code under MIT. If you use a GPL dependency, your entire project becomes bound by the GPL, effectively voiding your MIT license.";
        } else if (dep.license === "lgpl") {
          severity = "WARNING";
          message = "Requires dynamic linking. If you statically link this, your project must adopt the LGPL, overriding your MIT choice.";
        }
      } else if (projectLicense === "gpl") {
        if (dep.license === "agpl") {
          severity = "WARNING";
          message = "AGPL is stricter than GPL (covers network use). Your project will effectively be upgraded to AGPL restrictions.";
        } else {
          message = "Compatible with your GPL project. (GPL 'infects' permissive licenses, which is legally fine).";
        }
      }

      if (severity === "CRITICAL") hasCritical = true;

      issues.push({ depName: dep.name, license: dep.license, severity, message });
    });

    return { issues, hasCritical };
  }, [projectLicense, deps]);

  return (
    <ToolLayout
      toolNum={77} category="🛠️ Developer Tools"
      title="Open-Source" titleHighlight="License Conflict Checker"
      description="Don't accidentally open-source your proprietary startup. Input your dependencies to run a deterministic matrix check against copyleft licenses like GPL and AGPL."
    >
      <div className="grid lg:grid-cols-[1fr_450px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="mb-6">
              <FieldLabel htmlFor="proj">Your Project's Target License</FieldLabel>
              <Select id="proj" value={projectLicense} onChange={setProjectLicense} options={PROJECT_LICENSES} />
            </div>

            <div className="flex justify-between items-center mb-4 pt-6 border-t border-slate-100">
              <SectionTitle>Dependencies</SectionTitle>
              <button onClick={addDep} className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                + Add Package
              </button>
            </div>
            
            <div className="space-y-3">
              {deps.map((dep) => (
                <div key={dep.id} className="flex gap-3 items-end p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex-1">
                    <FieldLabel htmlFor={`n-${dep.id}`}>Package Name</FieldLabel>
                    <TextInput id={`n-${dep.id}`} value={dep.name} onChange={(v) => updateDep(dep.id, 'name', v)} />
                  </div>
                  <div className="w-48">
                    <FieldLabel htmlFor={`l-${dep.id}`}>License</FieldLabel>
                    <Select id={`l-${dep.id}`} value={dep.license} onChange={(v) => updateDep(dep.id, 'license', v)} options={DEP_LICENSES} />
                  </div>
                  <button onClick={() => removeDep(dep.id)} className="w-10 h-[42px] mb-[2px] flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded-xl transition-colors">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className={`bg-gradient-to-br px-6 py-6 rounded-t-2xl text-center ${conflicts.hasCritical ? 'from-rose-700 to-red-800' : 'from-emerald-600 to-green-700'}`}>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                {conflicts.hasCritical ? '⚠️' : '✅'}
              </div>
              <h3 className="text-white font-bold text-xl mb-1">
                {conflicts.hasCritical ? "Critical Conflict Detected" : "Matrix Clear"}
              </h3>
              <p className="text-white/80 text-sm">
                {conflicts.hasCritical ? "You are violating open-source terms." : "No blocking licensing conflicts found."}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-b-2xl max-h-[60vh] overflow-y-auto space-y-4">
              {conflicts.issues.map((issue, idx) => (
                <div key={idx} className={`p-4 rounded-xl border-l-4 ${
                  issue.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-500' : 
                  issue.severity === 'WARNING' ? 'bg-amber-50 border-amber-500' : 
                  'bg-slate-50 border-emerald-500'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-slate-800 font-mono text-sm">{issue.depName || "Unnamed Package"}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      issue.severity === 'CRITICAL' ? 'bg-rose-200 text-rose-800' : 
                      issue.severity === 'WARNING' ? 'bg-amber-200 text-amber-800' : 
                      'bg-emerald-200 text-emerald-800'
                    }`}>{issue.license}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">
                    {issue.message}
                  </p>
                </div>
              ))}
            </div>
          </ResultCard>
          <div className="text-center text-xs text-slate-400">
            Based on strict Free Software Foundation copyleft definitions. Not legal advice.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
