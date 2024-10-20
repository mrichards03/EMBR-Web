"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Dropdown, MenuProps } from "antd";
import {
  useJsApiLoader,
  GoogleMap as GoogleMapReact,
} from "@react-google-maps/api";

import FleetBar from "./FleetBar";
import Search from "./Search";
import Stats from "./Stats";
import ToggleSwitch from "./ToggleSwitch";
import ZoomControl from "./ZoomControl";
import MissionCreate from "./MissionControls/MissionCreate";

import { dummyFleets } from "@/data/fleets";
import homeImage from "../../public/home.png";
import logo from "../../public/white_logo.svg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getIsLoggedIn } from "@/redux/logging/selectors";
import { setIsLoggedIn } from "@/redux/logging/slice";

const exampleMapStyles: google.maps.MapTypeStyle[] = [
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];

const zoom: number = 14;
const zoomFleet: number = 16;
const center: google.maps.LatLngLiteral = {
  lat: 49.93216079437889,
  lng: -119.43347832660766,
};

const RobotStateBadgeColors = {
  active: "#93FF9E",
  chargingRequired: "#FFFB93",
  attentionRequired: "#FF9393",
  systemFailed: "#FE5555",
};

const RobotStateColors = {
  active: "#40FF53",
  chargingRequired: "#FFF967",
  attentionRequired: "#F51515",
  systemFailed: "#F51515",
};

const RobotStateTexts = {
  active: "Active",
  chargingRequired: "Charging Required",
  attentionRequired: "Attention Required",
  systemFailed: "System Failed",
};

export const RobotStateType = {
  active: {
    color: RobotStateColors["active"],
    bgColor: RobotStateBadgeColors["active"],
    text: RobotStateTexts["active"],
  },
  chargingRequired: {
    color: RobotStateColors["chargingRequired"],
    bgColor: RobotStateBadgeColors["chargingRequired"],
    text: RobotStateTexts["chargingRequired"],
  },
  attentionRequired: {
    color: RobotStateColors["attentionRequired"],
    bgColor: RobotStateBadgeColors["attentionRequired"],
    text: RobotStateTexts["attentionRequired"],
  },
  systemFailed: {
    color: RobotStateColors["systemFailed"],
    bgColor: RobotStateBadgeColors["systemFailed"],
    text: RobotStateTexts["systemFailed"],
  },
};

export interface CoordinatesType {
  lat: number;
  lng: number;
}

export interface MissionType {
  name: string;
  process: number;
  smokesDetected: number;
  averageTemperature: number;
  timePassed: number;
  timeEstimated: number;
  redCoordinates?: CoordinatesType[];
  orangeCoordinates?: CoordinatesType[];
  blueCoordinates?: CoordinatesType[] | google.maps.MVCArray<any>;
  robots?: RobotType[];
  smokes?: CoordinatesType[];
}

export interface NewMissionType extends MissionType {
  fleetName: string;
  fleetId: string | number;
}

export interface RobotType {
  id: string;
  name: string;
  state: "active" | "chargingRequired" | "attentionRequired" | "systemFailed";
  coordinates: CoordinatesType;
}

export interface FleetItemType {
  id: string | number;
  name: string;
  center: CoordinatesType;
  missions: MissionType[];
}

const newMissionTemplate: NewMissionType = {
  name: "",
  fleetId: "",
  fleetName: "",
  process: 0,
  smokesDetected: 0,
  averageTemperature: 0,
  timePassed: 0,
  timeEstimated: 2880,
  blueCoordinates: undefined,
  robots: [],
  smokes: [],
};

const items: MenuProps["items"] = [
  {
    key: "edit",
    label: (
      <button
        disabled
        className="left-[35px] px-3.5 py-1 rounded-[22px] text-[15px] leading-[18px] border border-black hover:!bg-lightgray disabled:!bg-transparent"
      >
        Edit
      </button>
    ),
  },
  {
    key: "create",
    label: (
      <button className="left-[35px] px-3.5 py-1 rounded-[22px] text-[15px] leading-[18px] border border-black hover:!bg-lightgray disabled:!bg-transparent">
        Create
      </button>
    ),
  },
  {
    key: "delete",
    label: (
      <button
        disabled
        className="left-[35px] px-3.5 py-1 rounded-[22px] text-[15px] leading-[18px] border border-black hover:!bg-lightgray disabled:!bg-transparent"
      >
        Delete
      </button>
    ),
  },
];

const CustomGoogleMap: React.FC = () => {
  const router = useRouter();
  const isLoggedIn = useAppSelector(getIsLoggedIn);
  const dispatch = useAppDispatch();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [fleets, setFleets] = useState<FleetItemType[]>(dummyFleets);
  const [activeFleet, setActiveFleet] = useState<string | number | null>(null);
  const [activeMissionCreate, setActiveMissionCreate] =
    useState<boolean>(false);
  const [satelliteView, setSatelliteView] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(zoom);
  const [cancelDrawing, setCancelDrawing] = useState<any>();
  const [newMission, setNewMission] =
    useState<NewMissionType>(newMissionTemplate);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    libraries: ["places"],
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapOptions = isLoaded
    ? {
        styles: exampleMapStyles,
        streetViewControl: false,
        scaleControl: false,
        fullscreenControl: false,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        rotateControl: false,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        mapTypeId: satelliteView ? "satellite" : "roadmap",
        zoom: zoomLevel,
      }
    : {};

  const onLoad = useCallback(function callback(map: google.maps.Map | null) {
    if (map) setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const saveCreate = (mission: NewMissionType) => {
    setActiveMissionCreate(false);
    updateFleets([mission]);
    localStorage.setItem(
      "customMissions",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("customMissions") || "[]"),
        mission,
      ])
    );
  };

  const cancelCreate = () => {
    setActiveMissionCreate(false);
    cancelDrawing.cancelDrawing();
    enable(map!);
  };

  const handleDraw = () => {
    if (map) {
      disable(map);
      google.maps.event.addDomListener(map.getDiv(), "mousedown", function () {
        setCancelDrawing(drawFreeHand(map));
      });
    }
  };

  const drawFreeHand = (map: google.maps.Map) => {
    let poly = new google.maps.Polyline({ map, clickable: false });
    let path = poly.getPath();
    let move: google.maps.MapsEventListener | null = null;

    const cancelDrawing = () => {
      setNewMission(newMissionTemplate);
      if (move) {
        google.maps.event.removeListener(move);
        move = null;
      }
      path.clear();
      poly.setMap(null);
      google.maps.event.clearListeners(map.getDiv(), "mousedown");
    };

    const completeDrawing = () => {
      if (move) {
        google.maps.event.removeListener(move);
        move = null;
      }

      if (path.getLength() > 0) {
        poly.setMap(null);

        const smoothedPath = smoothPath(path);

        console.log(
          smoothedPath.getArray().map((latLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
          }))
        );

        setNewMission((prev) => ({
          ...prev,
          blueCoordinates: smoothedPath.getArray().map((latLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
          })),
        }));
        poly = new google.maps.Polygon({
          map,
          paths: smoothedPath,
          fillColor: "#0054EA",
          fillOpacity: 0.05,
          strokeColor: "#0054EA",
          strokeWeight: 2,
        });
      }

      google.maps.event.clearListeners(map.getDiv(), "mousedown");
      enable(map);
    };

    move = google.maps.event.addListener(
      map,
      "mousemove",
      function (e: MouseEvent) {
        path.push((e as any).latLng);
      }
    );

    google.maps.event.addListenerOnce(map, "mouseup", completeDrawing);

    return {
      cancelDrawing: () => {
        cancelDrawing();
      },
    };
  };

  const smoothPath = (path: google.maps.MVCArray) => {
    const smoothedPath: google.maps.MVCArray = new google.maps.MVCArray();
    const pathLength = path.getLength();
    for (let i = 0; i < pathLength; i++) {
      const point1 = path.getAt(i);
      const point2 = path.getAt((i + 1) % pathLength);

      const firstQuarter = google.maps.geometry.spherical.interpolate(
        point1,
        point2,
        0.25
      );
      const thirdQuarter = google.maps.geometry.spherical.interpolate(
        point1,
        point2,
        0.75
      );

      smoothedPath.push(firstQuarter);
      smoothedPath.push(thirdQuarter);
    }
    return smoothedPath;
  };

  const disable = (map: google.maps.Map) => {
    map.setOptions({
      draggable: false,
      zoomControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: false,
    });
  };

  const enable = (map: google.maps.Map) => {
    map.setOptions({
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: true,
    });
  };

  const updateFleets = (newMissions: NewMissionType[]) => {
    const updatedFleets = fleets.map((fleet) => {
      const fleetMissions = newMissions.filter(
        (mission: NewMissionType) => mission.fleetId === fleet.id
      );
      return {
        ...fleet,
        missions: [...fleet.missions, ...fleetMissions],
      };
    });

    setFleets(updatedFleets);

    updatedFleets.forEach((fleet) =>
      fleet.missions.forEach((mission) => {
        const redPoly = new google.maps.Polygon({
          paths: mission.redCoordinates,
          strokeColor: "#FF3131",
          strokeWeight: 2,
          fillColor: "#FF3131",
          fillOpacity: 0.15,
        });
        const orangePoly = new google.maps.Polygon({
          paths: mission.orangeCoordinates,
          strokeColor: "#F57C15",
          strokeWeight: 2,
          fillColor: "#F57C15",
          fillOpacity: 0.1,
        });
        const bluePoly = new google.maps.Polygon({
          paths: mission.blueCoordinates,
          strokeColor: "#0054EA",
          strokeWeight: 2,
          fillColor: "#0054EA",
          fillOpacity: 0.05,
        });

        mission.robots?.forEach((robot: RobotType) => {
          const svgMarker = {
            path: `M5,10a5,5 0 1,0 10,0a5,5 0 1,0 -10,0`,
            fillColor: RobotStateType[robot.state].color,
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(10, 10),
          };

          const marker = new google.maps.Marker({
            position: robot.coordinates,
            icon: svgMarker,
            label: {
              text: robot.name,
              color: RobotStateType[robot.state].color,
            },
            map,
          });

          marker.addListener("click", () => {
            router.push("/embr-details");
          });
        });

        mission.smokes?.forEach((smoke: CoordinatesType) => {
          const svgMarker = {
            path: "m91.44 54.89c-.29 10.89-4.84 20-10.16 29-5 8.37-12.74 13.82-20 19.76-4.65 3.78-9.63 7.15-14.37 10.82a16.1 16.1 0 0 0 -3.47 3.71c-5.94 8.8-11.26 17.89-13.16 28.6-.74 4.16-4 5.42-7.57 3.23a5.36 5.36 0 0 1 -1.36-1c-3.58-4.43-7.53-8.63-10.56-13.41s-5.22-10.16-7.69-15.32c-3.75-7.87-3.72-16-1.7-24.31 2.91-12 9.24-22 17.45-31 3.67-4 7.55-7.82 11.19-11.86 2.29-2.53 4.15-5.44 6.46-8 5.18-5.6 6.29-12.68 7.46-19.74.87-5.2-1.24-9.52-4.54-13.35-1.49-1.74-3.16-3.32-4.52-5.14a4.19 4.19 0 0 1 -.56-4.88 4.1 4.1 0 0 1 4.42-1.93c11.42 1.8 22.24 5.16 31.76 12.06a33.83 33.83 0 0 1 11.13 12.87 130.22 130.22 0 0 1 6.52 14.91c1.59 4.82 2.22 9.97 3.27 14.98zm-38.52-40.89c2.4 5.58 2.16 11 1.4 16.39-1.08 7.66-3.32 14.81-8.32 21.19a123.66 123.66 0 0 1 -14.3 16 68.2 68.2 0 0 0 -15.5 20.37 64.24 64.24 0 0 0 -5.06 15.4c-1.93 9 2.2 16.75 6.44 24.3 1.21 2.16 2.24 4.54 5 5.24 8.13-17.28 15.43-25.5 28.77-34.7a135.93 135.93 0 0 0 10.88-8.49 52.62 52.62 0 0 0 16.39-25.7c4.23-14.39-.5-27.07-8.6-38.85a26.32 26.32 0 0 0 -17.1-11.15z",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 0.2,
            anchor: new google.maps.Point(20, 20),
          };

          new google.maps.Marker({
            position: smoke,
            icon: svgMarker,
            map,
          });
        });

        redPoly.setMap(map);
        orangePoly.setMap(map);
        bluePoly.setMap(map);
      })
    );

    return updatedFleets;
  };

  useEffect(() => {
    if (map) {
      const storedMissions = JSON.parse(
        localStorage.getItem("customMissions") || "[]"
      );

      updateFleets(storedMissions);
    }
  }, [map]);

  useEffect(() => {
    if (activeFleet !== null) {
      map?.setCenter(fleets.find((fleet) => fleet.id === activeFleet)?.center!);
      map?.setZoom(zoomFleet);
    } else {
      // map?.setZoom(zoom);
    }
  }, [activeFleet, map]);

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 1, 21)); // Google Maps API allows a max zoom of 21
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 1, 0)); // Google Maps API allows a min zoom of 0
  };

  const handleMissionClick: MenuProps["onClick"] = ({ key }) => {
    setActiveFleet(null);
    switch (key) {
      case "create":
        setActiveMissionCreate(true);
        handleDraw();
        break;
      case "edit":
        undefined;
        break;
      case "delete":
        undefined;
        break;
      default:
        undefined;
        break;
    }
  };

  return isLoggedIn ? (
    isLoaded ? (
      <>
        <GoogleMapReact
          options={mapOptions}
          mapContainerClassName="w-screen h-screen py-[30px] px-[35px] relative flex justify-start items-start overflow-hidden"
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onZoomChanged={() => {
            if (map) setZoomLevel(map.getZoom() || zoom);
          }}
        >
          <div className="absolute left-[35px] flex flex-col gap-y-2.5 items-start">
            <FleetBar
              fleets={fleets}
              activeFleet={activeFleet}
              setActiveFleet={setActiveFleet}
              disabled={activeMissionCreate}
            />
            <div className="flex justify-start items-center gap-x-1">
              <button
                disabled
                className="left-[35px] text-[12px] leading-[15px] px-2 py-0.5 rounded-[22px] bg-white"
              >
                Edit
              </button>
              <button
                disabled
                className="left-[35px] px-2 py-0.5 text-[12px] leading-[15px] rounded-[22px] bg-white"
              >
                Create
              </button>
              <button
                disabled
                className="left-[35px] px-2 py-0.5 text-[12px] leading-[15px] rounded-[22px] bg-white"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="absolute right-[35px] flex flex-col gap-y-[36px] items-end max-w-[400px]">
            <Search />
            <div className="flex flex-col gap-y-3 w-full">
              {activeFleet !== null ? (
                <>
                  <div className="flex justify-start items-center gap-x-2.5">
                    <button className="left-[35px] px-3.5 py-1 rounded-[22px] text-[15px] leading-[18px] bg-white">
                      Past
                    </button>
                    <button className="left-[35px] px-3.5 py-1 rounded-[22px] text-[15px] leading-[18px] bg-white">
                      Current
                    </button>
                    <button className="left-[35px] px-3.5 py-1 rounded-[22px] text-[15px] leading-[18px] bg-white">
                      All
                    </button>
                    <Dropdown
                      menu={{ items, onClick: handleMissionClick }}
                      align={{ offset: [60, -26] }}
                      placement="bottomLeft"
                      className="cursor-pointer left-[35px] px-3.5 py-1 rounded-[22px] text-[15px] leading-[18px] bg-white select-none"
                      trigger={["click"]}
                    >
                      <span>•••</span>
                    </Dropdown>
                  </div>
                  <Stats
                    missions={
                      fleets.find((fleet) => fleet.id === activeFleet)
                        ?.missions!
                    }
                  />
                </>
              ) : activeMissionCreate ? (
                <MissionCreate
                  cancelCreate={cancelCreate}
                  saveCreate={saveCreate}
                  newMission={newMission}
                  setNewMission={setNewMission}
                  fleets={fleets.map((fleet) => ({
                    value: fleet.id,
                    label: fleet.name,
                  }))}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </GoogleMapReact>
        <div className="absolute bottom-5 right-5 flex flex-col flex-end justify-end float-right items-end gap-[5px]">
          <div className="flex items-center">
            <span
              className={`${
                satelliteView &&
                "text-white bg-black bg-opacity-50 px-2 py-1 rounded shadow"
              } text-sm font-medium text-gray-700 mr-2`}
            >
              Satellite View:
            </span>
            <ToggleSwitch
              enabled={satelliteView}
              setEnabled={setSatelliteView}
            />
          </div>
          <div className="flex items-center float-right">
            <ZoomControl onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
          </div>
        </div>
      </>
    ) : (
      <></>
    )
  ) : (
    <div className="w-screen h-screen relative flex justify-center items-center size-full">
      <Image
        src={homeImage}
        alt="homeImage"
        className="size-full absolute left-0 top-0 z-0"
      />
      <div className="flex flex-col justify-center items-center gap-y-[126px] relative z-[1]">
        <div className="w-[736px] size-full">
          <Image
            src={logo}
            alt="logo"
            className="size-full left-0 top-0 select-none"
          />
        </div>
        <button
          onClick={() => dispatch(setIsLoggedIn(true))}
          className="rounded-[40px] bg-white flex gap-x-[26px] py-[18px] px-[30px] text-[35px] leading-[42px] items-center"
        >
          Login
          <span>
            <svg
              width="42"
              height="26"
              viewBox="0 0 42 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="1.31134e-07"
                y1="13.5"
                x2="39"
                y2="13.5"
                stroke="black"
                stroke-width="3"
              />
              <path d="M27 2L39 13L27 24" stroke="black" stroke-width="3" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default CustomGoogleMap;
