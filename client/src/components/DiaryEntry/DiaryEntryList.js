
import { useContext } from "react";
import { diaryEntryContext } from "./DiaryEntryContext"; //importuji context pro 
import Card from 'react-bootstrap/Card';
import DeleteModal from "../DeleteModal";
import "./DiaryEntryList.css"
import DiaryEntryForm from "./DiaryEntryForm";

function DiaryEntryList({data}) {
    const { error, diaryEntryList, state, handlerMap } = useContext(diaryEntryContext); // contextem listuji všechny itineráře, které mám na serveru


    const handleDelete = async (id) => { //funkce pro mazání itineráře, funguje díky contextu, posílám tam jen id itineráře
        console.log(id)
        await handlerMap.diaryEntryDelete({
        id: id
        });
    }

  return (
<div className="diaryentryList">
    {data.map((diaryEntry) => ( 
        <Card className="cardContainer" >
        <Card.Body className="cardBody">
          <Card.Title>{diaryEntry.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{diaryEntry.dayOfWeek} - {diaryEntry.date}</Card.Subtitle>
          <Card.Text>
            {diaryEntry.text}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="cardFooter">
        <DiaryEntryForm id={diaryEntry.id} action={"Update"}></DiaryEntryForm>
        <DeleteModal item={"Diary Entry"} onDelete={handleDelete} 
              name={diaryEntry.name} id={diaryEntry.id} ></DeleteModal>
        </Card.Footer>
      </Card>
    ))
  }
  </div>)
}

export default DiaryEntryList;