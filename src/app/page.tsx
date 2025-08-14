"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/types/advocate";
import { isStringAnInteger } from "@/lib/helpers";
import { useRouter } from "next/navigation";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const router = useRouter();
  useEffect(() => {
    fetch("/api/advocates")
      .then((response) => {
        if (!response.ok && response.status === 500) {
          router.push("/500");
          return;
        }
        response.json().then((jsonResponse: { data: Advocate[] }) => {
          const { data } = jsonResponse;
          setAdvocates(data);
          setFilteredAdvocates(data);
        });
      })
      .catch((error) => {
        // We should not have console errors show especially for 500s this should be logged using datadog/sentry 
        console.error("Error fetching advocates:", error);
        router.push("/500");
      });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        (isStringAnInteger(searchTerm)
          ? advocate.yearsOfExperience === parseInt(searchTerm)
          : false)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={`${advocate.id}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s: string, index: number) => (
                    <div key={`${advocate.id}-${index}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
