import React, { useState, useEffect } from 'react';
import { Scenario, PCRDocument, TrainingMode } from '../types';
import { ScenarioSidebar } from './ScenarioSidebar';
import { PCRForm } from './PCRForm';
import { ModelPcrPanel } from './ModelPcrPanel';
import { FeedbackPanel } from './FeedbackPanel';
import { ReferencePanel } from './ReferencePanel';
import { ExportActions } from './ExportActions';
import { UserProvider, useUser } from '../context/UserContext';
import { UserProfile } from './UserProfile';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { CollaborationHub } from './CollaborationHub';
import { HandOffTrainer } from './HandOffTrainer';
import { AboutGuide } from './AboutGuide';

const PcrTrainerContent: React.FC = () => {
  const { user } = useUser();
  const [showProfile, setShowProfile] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [activeMode, setActiveMode] = useState<TrainingMode>('quick_drill');
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [pcrDocument, setPcrDocument] = useState<PCRDocument | null>(null);
  const [showModelPcr, setShowModelPcr] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [showHandOff, setShowHandOff] = useState(false);
  const [showAbout, setShowAbout] = useState(true); // Show guide on initial load
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Initialize document when scenario changes
  useEffect(() => {
    if (currentScenario) {
      setPcrDocument({
        id: crypto.randomUUID(),
        userId: 'current-user',
        scenarioId: currentScenario.id,
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'draft',
        version: 1,
        callNumber: '',
        date: new Date(),
        unit: '',
        crew: [],
        patient: {
          firstName: '',
          lastName: '',
          age: currentScenario.patientPresentation.demographics.age,
          gender: currentScenario.patientPresentation.demographics.gender as any,
          weight: currentScenario.patientPresentation.demographics.weight,
          allergies: [],
          medications: [],
          medicalHistory: [],
          chiefComplaint: ''
        },
        incident: {
          address: '',
          city: '',
          state: '',
          zip: '',
          dispatchTime: new Date(),
          enRouteTime: new Date(),
          onSceneTime: new Date(),
          patientContactTime: new Date(),
          incidentType: 'medical',
          mechanism: '',
          bodySystem: 'other',
          priority: 'non_urgent'
        },
        assessment: {
          primaryAssessment: {
            consciousness: 'alert',
            airway: 'open',
            breathing: 'adequate',
            circulation: 'adequate',
            mentalStatus: ''
          },
          vitalSigns: [],
          secondaryAssessment: { headToToe: [] },
          impressions: [],
          protocols: []
        },
        treatment: {
          medications: [],
          procedures: [],
          monitoring: []
        },
        transport: {
          destination: '',
          transportMode: 'ground',
          position: 'fowlers',
          monitoring: [],
          condition: 'stable',
          continuedCare: ''
        },
        narrative: {
          subjective: '',
          objective: '',
          assessment: '',
          plan: '',
          format: 'soap'
        },
        scores: {
          overall: 0,
          categories: [],
          aiAnalysis: {
            narrativeQuality: { clarity: 0, objectivity: 0, thoroughness: 0, organization: 0, grammarScore: 0, medicalTerminologyUsage: 0 },
            clinicalAccuracy: { assessmentAccuracy: 0, treatmentAppropriateness: 0, protocolCompliance: 0, criticalThinkingScore: 0 },
            completeness: { requiredFieldsCompleted: 0, missingElements: [], excessiveElements: [], timelinessScore: 0 },
            professionalismScore: 0,
            suggestions: []
          },
          completionTime: 0,
          timestamp: new Date()
        },
        feedback: [],
        sharedWith: [],
        comments: []
      });
    }
  }, [currentScenario]);

  // Glass UI Classes
  const glassContainerClass = "bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl";
  const glassPanelClass = "bg-slate-900/80 backdrop-blur-md border-r border-white/10";

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Sidebar - Scenarios & Navigation */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
        ${glassPanelClass} flex flex-col
      `}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            PCR Trainer Pro™
          </h1>
          <p className="text-xs text-slate-400 mt-1">ProMedixEMS™ Learning Ecosystem</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <ScenarioSidebar 
            activeMode={activeMode}
            onSelectScenario={setCurrentScenario}
            onModeChange={setActiveMode}
          />
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors mb-4"
            onClick={() => setShowProfile(true)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'JD'}
            </div>
            <div>
              <div className="font-medium">{user ? `${user.firstName} ${user.lastName}` : 'John Doe'}</div>
              <div className="text-xs text-slate-400 capitalize">{user?.role || 'Student Paramedic'}</div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 space-y-2 border-t border-white/5 pt-4">
            <div className="flex justify-between">
              <button onClick={() => setShowAbout(true)} className="hover:text-blue-400 transition-colors text-left">About & Guide</button>
              <a href="https://github.com/primalrockstar/ProMedixEMSAPP" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub Repo</a>
            </div>
            <div className="flex justify-between">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Report Bug</a>
            </div>
            
            <div className="pt-2 border-t border-white/5">
               <p className="text-[9px] leading-tight opacity-70 mb-2 text-slate-600">
                 <strong className="text-slate-500">MEDICAL DISCLAIMER:</strong> This application is for educational and simulation purposes only. It does not constitute medical advice, diagnosis, or treatment. Always adhere to your local EMS protocols and scope of practice.
               </p>
            </div>

            <div className="text-center pt-2 opacity-50 border-t border-white/5">
              <div>© 2025 ProMedixEMS™.</div>
              <div className="text-[9px] mt-1">Designed by WebConnect360, LLC.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
              onClick={() => setShowMobileMenu(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {currentScenario ? (
              <>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">
                  {currentScenario.category}
                </span>
                <h2 className="text-lg font-semibold">{currentScenario.title}</h2>
              </>
            ) : (
              <h2 className="text-lg font-semibold text-slate-400">Select a scenario to begin</h2>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto md:overflow-visible pl-2">
            <ExportActions pcrDocument={pcrDocument} />
            
            {activeMode !== 'exam_mimic' && (
              <button
                onClick={() => setShowReference(!showReference)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showReference
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                Reference
              </button>
            )}

            {activeMode !== 'exam_mimic' && (
              <button 
                onClick={() => setShowModelPcr(!showModelPcr)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                {showModelPcr ? 'Hide Model PCR' : 'View Model PCR'}
              </button>
            )}

            <button 
              onClick={() => setShowFeedback(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 transition-all shadow-lg shadow-blue-900/20 text-sm font-medium"
            >
              Submit & Score
            </button>

            {activeMode !== 'exam_mimic' && (
              <button
                onClick={() => setShowHandOff(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Hand-off
              </button>
            )}

            {activeMode !== 'exam_mimic' && (
              <button
                onClick={() => setShowCollaboration(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Collaborate
              </button>
            )}
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 overflow-hidden flex relative">
          {/* Narrative Editor (Center) */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="max-w-4xl mx-auto space-y-6">
              {currentScenario && (
                <div className={`${glassContainerClass} p-6 mb-6`}>
                  <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-4">Patient Presentation</h3>
                  <p className="text-slate-200 leading-relaxed">
                    {currentScenario.patientPresentation.historyOfPresentIllness}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">Vitals</div>
                      <div className="font-mono text-sm">
                        BP: {currentScenario.patientPresentation.initialVitalSigns.bloodPressure?.systolic}/{currentScenario.patientPresentation.initialVitalSigns.bloodPressure?.diastolic} <br/>
                        HR: {currentScenario.patientPresentation.initialVitalSigns.heartRate} <br/>
                        RR: {currentScenario.patientPresentation.initialVitalSigns.respiratoryRate} <br/>
                        SpO2: {currentScenario.patientPresentation.initialVitalSigns.oxygenSaturation}%
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">Chief Complaint</div>
                      <div className="font-medium">{currentScenario.patientPresentation.chiefComplaint}</div>
                    </div>
                  </div>
                </div>
              )}

              <PCRForm 
                document={pcrDocument} 
                onChange={setPcrDocument}
                glassClass={glassContainerClass}
              />
            </div>
          </div>

          {/* Right Panel (Model PCR / Feedback / Reference) */}
          {(showModelPcr || showFeedback || showReference) && (
            <div className="w-full md:w-96 border-l border-white/10 bg-slate-900/95 md:bg-slate-900/50 backdrop-blur-xl absolute right-0 top-0 bottom-0 z-30 shadow-2xl transform transition-transform duration-300 ease-in-out">
              {showFeedback ? (
                <FeedbackPanel 
                  scores={pcrDocument?.scores} 
                  onClose={() => setShowFeedback(false)} 
                />
              ) : showReference ? (
                <ReferencePanel 
                  onClose={() => setShowReference(false)} 
                />
              ) : (
                <ModelPcrPanel 
                  scenario={currentScenario} 
                  onClose={() => setShowModelPcr(false)} 
                />
              )}
            </div>
          )}
        </main>

        {/* User Profile Modal */}
        {showProfile && (
          <UserProfile 
            onClose={() => setShowProfile(false)} 
            onViewAnalytics={() => {
              setShowProfile(false);
              setShowAnalytics(true);
            }}
          />
        )}

        {/* Analytics Dashboard */}
        {showAnalytics && <AnalyticsDashboard onClose={() => setShowAnalytics(false)} />}

        {/* Collaboration Hub */}
        {showCollaboration && (
          <CollaborationHub 
            onClose={() => setShowCollaboration(false)} 
            onJoinSession={(sessionId) => {
              console.log('Joining session:', sessionId);
              setShowCollaboration(false);
              // In a real app, this would navigate to a session view
            }}
          />
        )}

        {/* Hand-off Trainer */}
        {showHandOff && (
          <HandOffTrainer
            document={pcrDocument}
            scenario={currentScenario}
            onClose={() => setShowHandOff(false)}
          />
        )}

        {/* About Guide */}
        {showAbout && <AboutGuide onClose={() => setShowAbout(false)} />}
      </div>
    </div>
  );
};

export const PcrTrainerApp: React.FC = () => (
  <UserProvider>
    <PcrTrainerContent />
  </UserProvider>
);
