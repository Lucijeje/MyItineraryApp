import { useContext } from "react";
import { dayPlanContext } from "./DayPlanContext";
import "./DayPlanList.css"
import Button from 'react-bootstrap/Button';
import LocationList from "../Location/LocationList";
import LocationForm from "../Location/LocationForm";
import DayPlanForm from "./DayPlanForm";
import DiaryEntryForm from "../DiaryEntry/DiaryEntryForm";

function DayPlanList({ dayPlans, itineraryId }) {
    const { error, dayPlanList, state } = useContext(dayPlanContext);

    if (state === "pending") {
        return <div className="loading-state">Loading day plans...</div>;
    }

    if (error) {
        return <div className="error-state"><h3>Error</h3><p>{error.message}</p></div>;
    }

    if (!dayPlanList || dayPlanList.length === 0) {
        return <div className="empty-state">No day plans available.</div>;
    }

    function parseEuropeanDate(dateStr) {
        const [day, month, year] = dateStr.split('.').map(Number);
        return new Date(year, month - 1, day);
    }

    let filteredDayPlans = dayPlanList.filter(dayPlan => dayPlans.includes(dayPlan.id));
    filteredDayPlans.sort((a, b) => parseEuropeanDate(a.date) - parseEuropeanDate(b.date));

    return (
        <div className="list">
            {filteredDayPlans.map((dayPlan) => (
                <div className="dayPlanCard">
                    <div className="dayPlanCardHeader">
                        <h3>{dayPlan.dayOfWeek}</h3>
                        <p>{dayPlan.date}</p>
                    </div>
                    <div className="dayPlanCardBody">
                        <p>{dayPlan.description}</p>
                    </div>
                    <div className="dayPlanCardLocations">
                        <h6>Locations</h6>
                        <LocationList id={dayPlan.id}></LocationList>
                    </div>
                    <div className="dayPlanCardFooter">
                        <LocationForm dayplanId={dayPlan.id} />
                        {dayPlan.diaryEntryId && dayPlan.diaryEntryId.length > 0 ? (
                            <Button size="sm" variant="secondary" disabled>Diary Already Created</Button>
                        ) : (
                            <DiaryEntryForm date={dayPlan.date} dayOfWeek={dayPlan.dayOfWeek} itineraryId={itineraryId} dayPlanId={dayPlan.id} action={"Create"} />
                        )}
                        <DayPlanForm dayPlan={dayPlan} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DayPlanList;
