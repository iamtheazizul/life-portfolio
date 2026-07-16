// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MilestoneDetailPage from "./Pages/MilestoneDetailPage"
import TimelineWithLine from './components/GrowthTimeline/Timeline';

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