// App.jsx
import GrowthTimeline from './components/GrowthTimeline/GrowthTimeline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MilestoneDetailPage from "./Pages/MilestoneDetailPage"
import SimpleTimeline from './components/GrowthTimeline/SimplerTimeline';
import TimelineWithLine from './components/GrowthTimeline/TimelineWithLine';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< TimelineWithLine />} />
        <Route path="/milestone/:id" element ={<MilestoneDetailPage />} /> 
      </Routes>

    </Router>
  );
}