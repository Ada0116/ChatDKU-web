"use client";

import { useState } from "react";

type SubItem = {
  name: string;
  description: string;
  hours?: string;
  location: string;
  image?: string;
};

type Marker = {
  id: number;
  type: "building" | "office" | "printer";
  top: number;
  left: number;
  items: SubItem[];
};

const markers: Marker[] = [
  {
    id: 1,
    type: "building",
    top: 320,
    left: 370,
    items: [
      {
        name: "Academic Building",
        description: "Abbreviation: AB",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/AB.jpg",
      },
    ],
  },
  {
    id: 2,
    type: "building",
    top: 340,
    left: 175,
    items: [
      {
        name: "Conference Center",
        description: "Abbreviation: CC",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/CC.jpg",
      },
    ],
  },
    {
    id: 3,
    type: "building",
    top: 480,
    left: 290,
    items: [
      {
        name: "Innovation Building",
        description: "Abbreviation: IB",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/IB.jpg",
      },
    ],
  },
    {
    id: 4,
    type: "building",
    top: 312,
    left: 238,
    items: [
      {
        name: "Water Pavilion",
        description: "",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/Water Pavilion.jpg",
      },
    ],
  },
    {
    id: 5,
    type: "building",
    top: 390,
    left: 580,
    items: [
      {
        name: "Library",
        description: "Abbreviation: LIB",
        hours: "8:00 - 23:00",
        location: "DKU Campus",
        image: "/photos/LIB.jpg",
      },
    ],
  },
    {
    id: 6,
    type: "building",
    top: 470,
    left: 470,
    items: [
      {
        name: "WHU-Duke Research Institute",
        description: "Abbreviation: WDR",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/WDR.jpg",
      },
    ],
  },
    {
    id: 7,
    type: "building",
    top: 305,
    left: 585,
    items: [
      {
        name: "Community Center W",
        description: "Abbreviation: CCTW",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/CCTW.jpg",
      },
    ],
  },
    {
    id: 8,
    type: "building",
    top: 300,
    left: 685,
    items: [
      {
        name: "Community Center E",
        description: "Abbreviation: CCTE",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/CCTE.jpg",
      },
    ],
  },
    {
    id: 9,
    type: "building",
    top: 295,
    left: 840,
    items: [
      {
        name: "Sports Complex",
        description: "Abbreviation: SC",
        hours: "Weekdays: 7:00 - 21:00 Weekends: 10:00 - 15:00",
        location: "DKU Campus",
        image: "/photos/SC.jpg",
      },
    ],
  },
    {
    id: 10,
    type: "building",
    top: 165,
    left: 860,
    items: [
      {
        name: "Soccer Field",
        description: "",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/Soccer.jpg",
      },
    ],
  },
    {
    id: 11,
    type: "building",
    top: 180,
    left: 661,
    items: [
      {
        name: "Students Residence",
        description: "",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/Residence.jpg",
      },
    ],
  },
    {
    id: 12,
    type: "building",
    top: 390,
    left: 755,
    items: [
      {
        name: "Administrative Building",
        description: "Abbreviation: ADB",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/ADB.jpg",
      },
    ],
  },
    {
    id: 13,
    type: "building",
    top: 483,
    left: 755,
    items: [
      {
        name: "Visitor Center",
        description: "Abbreviation: VC",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/VC.jpg",
      },
    ],
  },
    {
    id: 14,
    type: "building",
    top: 335,
    left: 630,
    items: [
      {
        name: "Academic Avenue",
        description: "",
        hours: "Open 24 hours",
        location: "DKU Campus",
        image: "/photos/Avenue.jpg",
      },
    ],
  },
  {
    id: 15,
    type: "office",
    top: 300,
    left: 685,
    items: [
      {
        name: "Office of Career Services",
        description: "careerservices@dukekunshan.edu.cn",
        hours: "Weekdays: 9:00 - 17:30",
        location: "CCTE 1019",
        image: "/photos/career.png",
      },
      {
        name: "Health Services",
        description: "campushealth@dukekunshan.edu.cn",
        hours: "Weekdays: 9:00 - 12:00 & 13:00 - 17:30",
        location: "CCTE 4200",
        image: "/photos/Health.png",
      },
      {
        name: "Office of Student Experience",
        description: "",
        location: "CCTE 4100 suite",
        image: "/photos/Experience.png",
      },
      {
        name: "Campus Engagement",
        description: "dkucampusengagement@dukekunshan.edu.cn",
        location: "CCTE 2019",
        image: "/photos/Engagement.png",
      },
      {
        name: "Chinese Student Services",
        description: "dku-chinese-student-services@dukekunshan.edu.cn",
        hours:"Weekdays: 9:00-12:00 & 13:00-17:30",
        location: "CCTE 4100",
        image: "/photos/Chinese.png",
      },
      {
        name: "International Student Services",
        description: "DKU-ISS@dukekunshan.edu.cn",
        hours:"Weekdays: 9:00-17:30",
        location: "CCTE 4111 & 4121",
        image: "/photos/ISS.png",
      },
      {
        name: "Counseling and Wellness Services (CAWS)",
        description: "caws@dukekunshan.edu.cn",
        hours:"Weekdays: 9:00-12:00 & 13:00-17:30",
        location: "CCTE 4300",
        image: "/photos/CAWS.png",
      },
      {
        name: "Student Conduct",
        description: "studentconduct@dukekunshan.edu.cn",
        hours:"Weekdays: 9:00-17:30",
        location: "CCTE 4100 suite",
        image: "/photos/Conduct.png",
      },
      {
        name: "Case Management",
        description: "Dku-ocm@dukekunshan.edu.cn",
        hours:"Weekdays: 9:00-12:00 & 13:00-17:30",
        location: "CCTE 4126",
        image: "/photos/Case.png",
      },
      {
        name: "Student Accessibility Services Office (SASO)",
        description: "SASO@dukekunshan.edu.cn",
        hours:"Weekdays: 9:00-12:00 & 13:00-17:30",
        location: "CCTE 4116",
        image: "/photos/Accessibility.png",
      },
    ],
  },
  {
    id: 16,
    type: "office",
    top: 390,
    left: 580,
    items: [
      {
        name: "Library Information Desk",
        description: "dkulibrary@dukekunshan.edu.cn",
        hours: "Weekdays: 9:00 - 21:00 Weekends: 14:00 - 21:00",
        location: "LIB 1F Information Desk",
        image: "/photos/library.png",
      },
      {
        name: "DKU Information Technology (DKU IT)",
        description: "service-desk@dukekunshan.edu.cn",
        hours: "Weekdays: 9:00-17:30",
        location: "LIB 1F DKU IT Service Desk or AB2004",
        image: "/photos/IT.png",
      },
    ],
  },
  {
    id: 17,
    type: "office",
    top: 320,
    left: 370,
    items: [
      {
        name: "Writing and Language Studio",
        description: "DKU_WLS@dukekunshan.edu.cn",
        hours: "",
        location: "AB 2101",
        image: "/photos/WLS.png",
      },
    ],
  },
  {
    id: 18,
    type: "printer",
    top: 390,
    left: 580,
    items: [
      {
        name: "Library Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\n1F Rooms 1010, 1118 – Ricoh (Color) \n2F Rooms 2022, 2120 – Ricoh (Color) \n3F Rooms 3109, 3113 – Ricoh (Color) \n4F Room 4115 – Ricoh (Color) ",
      },
    ],
  },
  {
    id: 19,
    type: "printer",
    top: 320,
    left: 370,
    items: [
      {
        name: "Academic Building Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\n1F Across from Room 1075 – Ricoh (BW) \n2F Room 2013 – Ricoh (Color) \n2F Near Room 2A33 – Ricoh (Color) \n2F Room 2004 – Ricoh (Color) \n3F Near Room 3221 – Ricoh (Color) \n3F Near Room 3031 – Ricoh (Color) ",
      },
    ],
  },
  {
    id: 20,
    type: "printer",
    top: 340,
    left: 175,
    items: [
      {
        name: "Conference Center Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\n1F Near Room 1071 – Ricoh (Color) \n2F Near Room 2056 – Ricoh (Color) \n2F Near Room 2095 – Ricoh (Color)  ",
      },
    ],
  },
  {
    id: 21,
    type: "printer",
    top: 190,
    left: 225,
    items: [
      {
        name: "Student Residences Hall Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\n2F Main Lounge – Ricoh (BW)  ",
      },
    ],
  },
  {
    id: 22,
    type: "printer",
    top: 180,
    left: 661,
    items: [
      {
        name: "Undergraduate Residence Hall Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\nA#1102, B#1001, C#1102, D#1001, E#1102, F#1001, G#1102, H#1001 – Ricoh (BW)   ",
      },
    ],
  },
  {
    id: 23,
    type: "printer",
    top: 240,
    left: 487,
    items: [
      {
        name: "Graduate Center Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\n1F Room 1102 – Ricoh (BW) ",
      },
    ],
  },
  {
    id: 24,
    type: "printer",
    top: 480,
    left: 290,
    items: [
      {
        name: "Innovation Building Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\n1F West Hallway – Ricoh (Color) \n1F East Hallway – Ricoh (Color) \n2F Rooms 2016, 2031, 2062 – Ricoh (Color) \n3F Rooms 3028, 3031 (Stapler), 3088 – Ricoh (Color/BW)  ",
      },
    ],
  },
  {
    id: 25,
    type: "printer",
    top: 390,
    left: 755,
    items: [
      {
        name: "Administration Building Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\n1F Rooms 1021, 1107A, 1208 – Ricoh (Color) \n2F Rooms 2003, 2203C – Ricoh (Color) \n3F Rooms 3003, 3014, 3201A – Ricoh (Color) \n4F Rooms 4003, 4201 – Ricoh (Color)  ",
      },
    ],
  },
  {
    id: 26,
    type: "printer",
    top: 295,
    left: 840,
    items: [
      {
        name: "Sports Complex Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\n2F Room 2108 – Ricoh (Color)  ",
      },
    ],
  },
  {
    id: 27,
    type: "printer",
    top: 300,
    left: 685,
    items: [
      {
        name: "Community Center E Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\n1F Room 1019D – Ricoh (Color) \n4F Room 4132 – Ricoh (Color) ",
      },
    ],
  },
  {
    id: 28,
    type: "printer",
    top: 470,
    left: 470,
    items: [
      {
        name: "WHU-DUKE Research Institute Printer",
        description: "",
        hours: "Open 24 hours",
        location: "\n1F Room 1129 – Ricoh (Color) \n1F Near Room 1012– Ricoh (Color) \n2F Rooms 2129, 2212 – Ricoh (Color) \n3F Rooms 3212, 3131 (Stapler) – Ricoh (Color) ",
      },
    ],
  },
  {
    id: 29,
    type: "office",
    top: 480,
    left: 290,
    items: [
      {
        name: "DKU Innovation and Entrepreneurship Initiative (DKU InE)",
        description: "dku-innovation@dukekunshan.edu.cn",
        location: "IB 2F",
        image: "/photos/INE.png",
      },
      {
        name: "Center for Teaching and Learning",
        description: "dku_ctl@dukekunshan.edu.cn",
        location: "IB 3018",
        image: "/photos/Teaching.png",
      },
    ],
  },
  {
    id: 30,
    type: "office",
    top: 390,
    left: 755,
    items: [
      {
        name: "Office of Undergraduate Advising",
        description: "advising@dukekunshan.edu.cn / DKU-arc@dukekunshan.edu.cn",
        location: "ADB 1F",
        image: "/photos/Advising.png",
      },
      {
        name: "Office of Assessment",
        description: "dku_assessment@dukekunshan.edu.cn",
        location: "ADB 1020",
        image: "/photos/Assessment.png",
      },
      {
        name: "Office of the Registrar",
        description: "dku-registrar@dukekunshan.edu.cn",
        location: "ADB 1107",
        image: "/photos/Registrar.png",
      },
    ],
  },
  {
    id: 31,
    type: "office",
    top: 340,
    left: 175,
    items: [
      {
        name: "Language and Culture Center",
        description: "DKU-LCC@dukekunshan.edu.cn",
        location: "CC 1070",
        image: "/photos/Language.png",
      },
    ],
  },
  {
    id: 32,
    type: "office",
    top: 180,
    left: 661,
    items: [
      {
        name: "Residence Life",
        description: "residencelife@dukekunshan.edu.cn",
        hours: "Weekdays: 9:00-17:30",
        location: "\nGraduate Apartments 1110 suite\nBuilding 15A 1101\nBuilding 15C 1101\nBuilding 15E 1101\nBuilding 15G 1101",
        image: "/photos/Residence.png",
      },
    ],
  },
];

export default function CampusMap({
  onAsk,
}: {
  onAsk: (reference: string) => void;
}) {
  const [selectedType, setSelectedType] = useState<
    "building" | "office" | "printer"
  >("building");
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredMarkers = markers.filter(
    (m) => m.type === selectedType
  );
  const isBottomHalf = selectedMarker && selectedMarker.top > 350;

  return (
    <div className="w-full flex justify-center items-start p-8">
      <div className="flex gap-8">

        <div
          className="relative w-[1000px] h-[650px]"
          onClick={() => setSelectedMarker(null)}
        >

          <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl border">
            <img src="/mapupdate.png" className="w-full h-full object-cover" />
          </div>

          <div className="absolute inset-0">

            {filteredMarkers.map((marker) => (
              <div
                key={marker.id}
                className="absolute -translate-x-1/2 -translate-y-full z-10"
                style={{ top: marker.top, left: marker.left }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMarker(marker);
                  setCurrentIndex(0);
                }}
              >
                <div className="relative cursor-pointer group">
                  <img
                    src="/pointer.png"
                    className="
                      relative w-15 h-15
                      drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]
                      group-hover:-translate-y-1
                      group-hover:scale-110
                      group-hover:drop-shadow-[0_14px_24px_rgba(0,0,0,0.6)]
                      transition-all duration-200
                    "
                  />
                </div>
              </div>
            ))}

            {selectedMarker && (
              <div
                className="absolute z-50 w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{
                  top: isBottomHalf
                    ? selectedMarker.top - 260 
                    : selectedMarker.top,   
                  left: selectedMarker.left + 40,
                }}
              >

                <button
                  onClick={() => setSelectedMarker(null)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black hover:scale-110 transition-all"
                >
                  ✕
                </button>

                {selectedMarker.items[currentIndex].image && (
                  <img
                    src={selectedMarker.items[currentIndex].image}
                    className="w-full h-32 object-cover"
                  />
                )}

                <div
                  className={`${
                    selectedMarker.items[currentIndex].image ? "p-4 pb-2" : "p-4"
                  }`}
                >

                  <div>
                    <div className="font-semibold text-lg">
                      {selectedMarker.items[currentIndex].name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {selectedMarker.items[currentIndex].description}
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    {selectedMarker.items[currentIndex].hours && (
                      <div>
                        <span className="font-medium">Open Hours:</span>{" "}
                        {selectedMarker.items[currentIndex].hours}
                      </div>
                    )}

                  <div className="whitespace-pre-line">
                    <span className="font-medium">Location:</span>{" "}
                    {selectedMarker.items[currentIndex].location}
                  </div>
                  </div>

                  <button
                    className="mt-4 w-full py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all"
                    onClick={() => {
                      const item = selectedMarker!.items[currentIndex];
                      const reference = `About ${item.name}`;
                      onAsk(reference);
                    }}
                  >
                    Ask ChatDKU about this
                  </button>

                  {/* next page */}
                  {selectedMarker.items.length > 1 && (
                    <div className="mt-1 mb-1 flex items-center justify-center gap-4">

                      <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 hover:scale-125 transition-all disabled:opacity-30"
                      >
                        ‹
                      </button>

                      <div className="text-sm text-gray-500">
                        {currentIndex + 1} / {selectedMarker.items.length}
                      </div>

                      <button
                        disabled={
                          currentIndex === selectedMarker.items.length - 1
                        }
                        onClick={() => setCurrentIndex((prev) => prev + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 hover:scale-125 transition-all disabled:opacity-30"
                      >
                        ›
                      </button>

                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>

        <div className="flex flex-col gap-4 mt-6">

          <button
            className={`px-4 py-2 rounded-xl transition-all hover:scale-105
            ${
              selectedType === "building"
                ? "bg-black text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => {
              setSelectedType("building");
              setSelectedMarker(null);
              setCurrentIndex(0);
            }}
          >
            Buildings
          </button>

          <button
            className={`px-4 py-2 rounded-xl transition-all hover:scale-105
            ${
              selectedType === "office"
                ? "bg-black text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => {
              setSelectedType("office");
              setSelectedMarker(null);
              setCurrentIndex(0);
            }}
          >
            Offices
          </button>

          <button
            className={`px-4 py-2 rounded-xl transition-all hover:scale-105
            ${
              selectedType === "printer"
                ? "bg-black text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => {
              setSelectedType("printer");
              setSelectedMarker(null);
              setCurrentIndex(0);
            }}
          >
            Printers
          </button>

        </div>

      </div>
    </div>
  );
}