import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import SpinWheel from '../components/SpinWheel';
import EnvelopeModal from '../components/EnvelopeModal';
import ChallengeCardModal from '../components/ChallengeCardModal';
import { Sparkles, FileText, CheckCircle2, Lock } from 'lucide-react';

export default function DashboardPage() {
  const { user, assignment, setAssignment, refreshParticipantData } = useAuth();

  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Modals state
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [spunResultTopic, setSpunResultTopic] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  // Fetch topics list for wheel segments
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const list = await apiFetch('/topics');
        setTopics(list);
      } catch (err) {
        console.error('Failed to load topics:', err);
      } finally {
        setLoadingTopics(false);
      }
    };
    loadTopics();
  }, []);

  const handleSpinRequest = async () => {
    setErrorMessage('');
    setIsSpinning(true);

    try {
      const res = await apiFetch('/spin', { method: 'POST' });
      setSpunResultTopic(res);

      // Wait 5.2 seconds for wheel spin animation to complete
      setTimeout(() => {
        setIsSpinning(false);
        setAssignment({
          id: res.topicId,
          topic: {
            id: res.topicId,
            topicName: res.topicName,
            requirements: res.requirements
          },
          assignedAt: res.assignedAt
        });

        // Trigger Envelope Reveal Modal
        setIsEnvelopeOpen(true);
      }, 5200);

      return res;
    } catch (err) {
      setIsSpinning(false);
      setErrorMessage(err.message || 'Spin failed.');
      return null;
    }
  };

  const handleEnvelopeClickOpen = () => {
    setIsEnvelopeOpen(false);
    setIsCardOpen(true);
  };

  // Determine UX Status Messaging
  let statusMessage = "Ready to discover your challenge?";
  let isSpinDisabled = false;

  if (assignment) {
    statusMessage = "Your challenge has already been assigned.";
    isSpinDisabled = true;
  } else if (topics.length > 0) {
    const assignedCount = topics.filter(t => t.status === 'ASSIGNED').length;
    if (assignedCount >= topics.length) {
      statusMessage = "All topics have been assigned.";
      isSpinDisabled = true;
    }
  }

  if (isSpinning) {
    statusMessage = "Your challenge has been selected!";
  } else if (isCardOpen) {
    statusMessage = "Here's your challenge.";
  }

  const activeTopic = assignment ? (assignment.topic || assignment) : (spunResultTopic || null);

  return (
    <div className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-between py-8 px-4 relative">
      
      {/* Dashboard Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-4 animate-fade-in">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-3 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
          <span>OFFICIAL TOPIC SELECTION</span>
        </div>

        <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-200 to-pink-300 tracking-tight">
          Spin & Choose
        </h2>

        <p className="text-slate-400 text-sm sm:text-base mt-2 font-medium">
          Spin the wheel and discover your challenge.
        </p>

        {/* Existing Assignment Banner */}
        {assignment && !isSpinning && (
          <div className="mt-4 inline-flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl glass-panel-glow border border-purple-500/40 text-purple-200 text-xs font-medium animate-pulse">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Assigned Topic: <strong className="text-white font-bold">{assignment.topic?.topicName || assignment.topicName}</strong></span>
            </div>
            <button
              onClick={() => setIsCardOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Challenge Card</span>
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
            {errorMessage}
          </div>
        )}

      </div>

      {/* Main Spin Wheel Centerpiece */}
      <div className="w-full my-auto flex flex-col items-center">
        <SpinWheel
          topics={topics}
          onSpin={handleSpinRequest}
          isSpinning={isSpinning}
          disabled={isSpinDisabled}
          statusMessage={statusMessage}
        />
      </div>

      {/* Envelope Reveal Modal */}
      <EnvelopeModal
        isOpen={isEnvelopeOpen}
        onOpenChallenge={handleEnvelopeClickOpen}
        topicName={activeTopic?.topicName}
      />

      {/* Paper Challenge Card Modal */}
      <ChallengeCardModal
        isOpen={isCardOpen}
        onClose={() => setIsCardOpen(false)}
        assignment={activeTopic}
        participant={user}
      />

    </div>
  );
}
