"use client";
import React from "react";
import { useState } from "react";
import WeatherStat from "./WeatherStat";
import AirQualityIndex from "./AirQualityIndex";
import ErrorModal from "./ErrorModal";
import ErrorBoundary from "./ErrorBoundary";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState({
    city: "",
    state: "",
    country: "",
  });
  const [showError, setShowError] = useState(false);
  const [showErrModal, setShowErrModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [location, setLocation] = useState({
    latitude: 28.6517178,
    longitude: 77.2219388,
    name: "Delhi",
    state: "Delhi",
    country: "IN",
  });
  const handleModal = () => {
    setShowErrModal(!showErrModal);
  };
  const handleChange = (searchContent: string) => {
    const anRegex = /[0-9]/;
    const spclRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/;
    if (anRegex.test(searchContent) || spclRegex.test(searchContent)) {
      setShowError(true);
      return;
    }
    if (searchContent.includes(",")) {
      if (searchContent.split(",").length > 3) {
        setShowError(true);
        return;
      }
      setShowError(false);
      if (searchContent.split(",").length === 2) {
        setSearchValue({
          city: searchContent.split(",")[0],
          state: "",
          country: searchContent.split(",")[1],
        });
      } else {
        setSearchValue({
          city: searchContent.split(",")[0],
          state: searchContent.split(",")[1],
          country: searchContent.split(",")[2],
        });
      }
      return;
    }
    setShowError(false);
    setSearchValue({
      city: searchContent.split(",")[0],
      state: "",
      country: "",
    });
  };
  const handleSearch = () => {
    if (showError) {
      setErrMsg("The Entered City Name Can Only Accept Letters !!");
      setShowErrModal(true);
      return;
    }
    setShowErrModal(false);
    fetch(
      "http://localhost:4000/location?city=" +
        searchValue.city +
        `${searchValue.state === "" ? "" : `&state=${searchValue.state}`}` +
        `${searchValue.country === "" ? "" : `&country=${searchValue.country}`}`
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (Object.hasOwn(res, "Error")) {
          throw new Error(res.Error);
        }
        setLocation(res);
      })
      .catch((err) => {
        setErrMsg(err.message);
        setShowErrModal(true);
      });
  };
  return (
    <ErrorBoundary>
      <div className="hero min-h-max">
        <div className="hero-content flex-col lg:flex-col">
          <div className="w-80 max-w-md">
            <label className="form-control">
              <div className="label">
                <span className="label-text">What is your city?</span>
              </div>
              <input
                type="text"
                placeholder="Type your city here... eg: Delhi"
                onChange={(event) => {
                  handleChange(event.target.value as string);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className={`input input-bordered w-full ${
                  showError ? "input-error" : "input-success"
                }`}
              />
            </label>
          </div>
        </div>
      </div>

      <WeatherStat
        location={{ lat: location.latitude, lng: location.longitude }}
      ></WeatherStat>

      <AirQualityIndex
        location={{ lat: location.latitude, lng: location.longitude }}
      ></AirQualityIndex>

      {showErrModal ? (
        <ErrorModal
          errMsg={errMsg}
          modalState={showErrModal}
          handleModal={handleModal}
        ></ErrorModal>
      ) : (
        <></>
      )}
    </ErrorBoundary>
  );
};

export default SearchBar;
