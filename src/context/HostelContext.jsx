
import { createContext, useContext, useState } from "react";

const HostelContext = createContext();

export function HostelProvider({ children }) {
  const [rooms, setRooms] = useState([
    { number: "101", block: "A", capacity: 4, beds: 2 },
    { number: "102", block: "A", capacity: 4, beds: 0 },
    { number: "201", block: "B", capacity: 3, beds: 1 },
    { number: "202", block: "B", capacity: 4, beds: 3 },
    { number: "301", block: "C", capacity: 2, beds: 1 },
    { number: "302", block: "C", capacity: 3, beds: 0 },
  ]);

  const [requests, setRequests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Room booking management
  const addRequest = (request) => {
    setRequests((previous) => [
      ...previous,
      { ...request, id: Date.now(), status: "Pending" },
    ]);
  };

  const updateRequest = (id, status) => {
    const request = requests.find((item) => item.id === id);

    if (!request || request.status !== "Pending") return;

    if (status === "Approved") {
      const room = rooms.find((item) => item.number === request.room);

      if (!room || room.beds < 1) {
        alert("No beds are currently available in this room.");
        return;
      }

      setRooms((previous) =>
        previous.map((item) =>
          item.number === request.room
            ? { ...item, beds: item.beds - 1 }
            : item
        )
      );
    }

    setRequests((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  // Application management
  const addApplication = (application) => {
    setApplications((previous) => [
      ...previous,
      {
        ...application,
        id: Date.now(),
        status: "Pending",
      },
    ]);
  };

  const updateApplication = (id, status) => {
    setApplications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  // Complaint management
  const addComplaint = (complaint) => {
    setComplaints((previous) => [
      ...previous,
      {
        ...complaint,
        id: Date.now(),
        status: "Submitted",
      },
    ]);
  };

  const updateComplaint = (id, status) => {
    setComplaints((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  return (
    <HostelContext.Provider
      value={{
        rooms,
        setRooms,
        requests,
        addRequest,
        updateRequest,
        applications,
        addApplication,
        updateApplication,
        complaints,
        addComplaint,
        updateComplaint,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
}

export function useHostel() {
  return useContext(HostelContext);
}
