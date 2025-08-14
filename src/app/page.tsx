"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/types/advocate";
import { isStringAnInteger } from "@/lib/helpers";
import { useRouter } from "next/navigation";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  useEffect(() => {
    filterAdvocates();
  }, [searchTerm]);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase().trim());
  };

  function filterAdvocates() {
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm) ||
        advocate.lastName.toLowerCase().includes(searchTerm) ||
        advocate.city.toLowerCase().includes(searchTerm) ||
        advocate.degree.toLowerCase().includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        (isStringAnInteger(searchTerm)
          ? advocate.yearsOfExperience === parseInt(searchTerm)
          : false)
      );
    });
    setFilteredAdvocates(filteredAdvocates);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-primary-default">
          Solace Advocates
        </h1>
        <p className="text-sm text-neutral-dark-grey">
          Search and filter to find the right advocate.
        </p>
      </header>
      <section className="bg-neutral-white border border-neutral-light-grey rounded-xl shadow-sm p-5 mb-8">
        <label className="block text-sm font-medium text-neutral-dark-grey">
          Search
        </label>

        <div className="mt-2 flex items-center gap-3">
          <input
            id="advocate-search"
            type="text"
            placeholder="Name, city, degree, specialty, or years (e.g. 10)"
            onChange={onChange}
            value={searchTerm}
            className="w-full rounded-lg border border-neutral-light-grey px-3 py-2 text-sm outline-none focus:border-primary-selected focus:ring-2 focus:ring-primary-focused/20"
          />
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="shrink-0 rounded-lg border border-neutral-light-grey px-3 py-2 text-sm text-primary-default hover:border-primary-selected hover:bg-neutral-white"
          >
            Reset
          </button>
        </div>

        <p className="mt-2 text-xs text-neutral-grey">
          {searchTerm ? (
            <>
              Searching for:{" "}
              <span className="font-medium text-primary-default">
                {searchTerm}
              </span>
            </>
          ) : (
            "Type to filter results"
          )}
        </p>
      </section>

      <section className="bg-neutral-white border border-neutral-light-grey rounded-xl shadow-sm">
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full table-auto text-sm mb-4">
            <thead className="bg-primary text-white">
              <tr>
                {[
                  "First Name",
                  "Last Name",
                  "City",
                  "Degree",
                  "Specialties",
                  "Years of Experience",
                  "Phone Number",
                ].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-left font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light-grey">
              {filteredAdvocates.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-neutral-grey"
                  >
                    No advocates found.
                  </td>
                </tr>
              ) : (
                filteredAdvocates.map((advocate, rowIdx) => (
                  <tr key={advocate.id}>
                    <td className="px-4 py-3">{advocate.firstName}</td>
                    <td className="px-4 py-3">{advocate.lastName}</td>
                    <td className="px-4 py-3">{advocate.city}</td>
                    <td className="px-4 py-3">{advocate.degree}</td>
                    <td className="px-4 py-3">
                      {Array.isArray(advocate.specialties)
                        ? advocate.specialties.map((s: string, i: number) => (
                            <span
                              key={`${advocate.id}-${i}`}
                              className="mr-1 mb-1 inline-block rounded-full bg-accent-light px-2 py-0.5 text-xs text-primary-default"
                            >
                              {s}
                            </span>
                          ))
                        : advocate.specialties}
                    </td>
                    <td className="px-4 py-3">{advocate.yearsOfExperience}</td>
                    <td className="px-4 py-3">{advocate.phoneNumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Row count */}
        <div className="px-4 py-3 border-t border-neutral-light-grey text-xs text-neutral-grey">
          Showing {filteredAdvocates.length}{" "}
          {filteredAdvocates.length === 1 ? "result" : "results"}
        </div>
      </section>
    </main>
  );
}
