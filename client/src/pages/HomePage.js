import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { itineraryContext } from '../components/Itinerary/ItineraryContext';
import { dayPlanContext } from '../components/DayPlan/DayPlanContext';
import { diaryEntryContext } from '../components/DiaryEntry/DiaryEntryContext';
import './HomePage.css';

function HomePage() {
  const { itineraryList, state: itineraryState } = useContext(itineraryContext);
  const { dayPlanList, state: dayPlanState } = useContext(dayPlanContext);
  const { diaryEntryList, state: diaryState } = useContext(diaryEntryContext);

  // Calculate statistics
  const totalItineraries = itineraryList?.length || 0;
  const totalDayPlans = dayPlanList?.length || 0;
  const totalDiaryEntries = diaryEntryList?.length || 0;
  
  // Count upcoming itineraries
  const parseDate = (dateString) => {
    if (!dateString) return new Date(0);
    const parts = dateString.split('.');
    if (parts.length !== 3) return new Date(0);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingItineraries = itineraryList?.filter(itinerary => {
    const startDate = parseDate(itinerary.startDate);
    return startDate >= today;
  }).length || 0;

  const pastItineraries = totalItineraries - upcomingItineraries;

  // Get recent itineraries (upcoming, max 3)
  const recentItineraries = itineraryList
    ?.filter(itinerary => {
      const startDate = parseDate(itinerary.startDate);
      return startDate >= today;
    })
    .sort((a, b) => {
      const dateA = parseDate(a.startDate);
      const dateB = parseDate(b.startDate);
      return dateA - dateB;
    })
    .slice(0, 3) || [];

  return (
    <div className="homepage-container">
      <div className="homepage-hero">
        <h1>Welcome to My Itinerary App</h1>
        <p className="homepage-subtitle">
          Plan your travels, organize your adventures, and capture your memories all in one place.
        </p>
      </div>

      <div className="homepage-stats">
        <Card className="stat-card">
          <Card.Body>
            <div className="stat-icon">✈️</div>
            <Card.Title className="stat-number">{totalItineraries}</Card.Title>
            <Card.Text className="stat-label">Total Itineraries</Card.Text>
            <div className="stat-description">
              Plan and organize all your travel adventures
            </div>
            <div className="stat-details">
              <span className="stat-upcoming">{upcomingItineraries} upcoming</span>
              <span className="stat-past">{pastItineraries} past</span>
            </div>
          </Card.Body>
        </Card>

        <Card className="stat-card">
          <Card.Body>
            <div className="stat-icon">📅</div>
            <Card.Title className="stat-number">{totalDayPlans}</Card.Title>
            <Card.Text className="stat-label">Day Plans</Card.Text>
            <div className="stat-description">
              Organized daily schedules across all your trips
            </div>
          </Card.Body>
        </Card>

        <Card className="stat-card">
          <Card.Body>
            <div className="stat-icon">📝</div>
            <Card.Title className="stat-number">{totalDiaryEntries}</Card.Title>
            <Card.Text className="stat-label">Diary Entries</Card.Text>
            <div className="stat-description">
              Memories and experiences captured
            </div>
          </Card.Body>
        </Card>
      </div>

      {recentItineraries.length > 0 && (
        <div className="homepage-upcoming">
          <h2>Upcoming Itineraries</h2>
          <div className="upcoming-list">
            {recentItineraries.map((itinerary) => (
              <Card key={itinerary.id} className="upcoming-card">
                <Card.Body>
                  <Card.Title>{itinerary.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {itinerary.destination}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Dates:</strong> {itinerary.startDate} - {itinerary.endDate}
                  </Card.Text>
                  {itinerary.description && (
                    <Card.Text className="itinerary-description">
                      {itinerary.description.length > 150
                        ? `${itinerary.description.substring(0, 150)}...`
                        : itinerary.description}
                    </Card.Text>
                  )}
                  <Link to={`/itinerary/${itinerary.id}`}>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {totalItineraries === 0 && (
        <div className="homepage-empty">
          <div className="empty-icon">🌍</div>
          <h2>Start Your Journey</h2>
          <p>You don't have any itineraries yet. Create your first one to start planning your adventures!</p>
          <p className="empty-hint">Click the "Create Itinerary" button in the sidebar to get started.</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
