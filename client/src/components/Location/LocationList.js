
import { useContext } from "react";
import { locationContext } from "./LocationContext"; //importuji context pro 
import DeleteModal from "../DeleteModal";
import "./LocationList.css"

function LocationList({id}) {
    const { error, locationList, state, handlerMap } = useContext(locationContext); // contextem listuji všechny itineráře, které mám na serveru

    console.log(locationList)
    if (state === "pending") {
      return <div className="loading-state" style={{padding: '1rem', fontSize: '0.9rem'}}>Loading locations...</div>;
  }

  if (error) {
      return <div className="error-state" style={{padding: '1rem', fontSize: '0.9rem'}}><h3>Error</h3><p>{error.message}</p></div>;
  }

  if (!locationList || locationList.length === 0) {
      return <div className="empty-state" style={{padding: '1rem', fontSize: '0.9rem'}}>No locations available.</div>;
  }

  const handleDelete = async (id) => { //funkce pro mazání itineráře, funguje díky contextu, posílám tam jen id itineráře
    console.log(id)
    await handlerMap.locationDelete({
    id: id
    });

}   

  let filteredLocations = locationList.filter(location => id.includes(location.dayPlanId));

  console.log(filteredLocations)

  return (
    <div className="locationList">
      {filteredLocations.length > 0 ? (
        filteredLocations.map((location) => (
          <div className="location" key={location.id}>
            <div className="information">
              <h6>{location.name}</h6>
              <p>{location.address}</p>
            </div>
            <div className="button">
              <DeleteModal
                onDelete={handleDelete}
                name={location.name}
                item={"location"}
                id={location.id}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="no-locations">Žádné přidané lokace</div>
      )}
    </div>
  );
}

export default LocationList;