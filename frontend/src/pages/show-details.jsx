import { useEffect, useState } from "react";
import DetailsCard from "../my-components/details-card";
import { useShowStore } from "../stores/show-store";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommentSection from "../my-components/comment-section";
import ShowModal from "../my-components/show-modal";
import NoShowsFound from "../my-components/no-shows-found";
import ShowCard from "../my-components/show-card";
import api from "../lib/axios-utils";
import { motion, AnimatePresence } from "framer-motion";

function ShowDetails() {
  const { id } = useParams();
  const token = JSON.parse(localStorage.getItem("token"));
  const currentShow = useShowStore((s) => s.currentShow);
  const setCurrentShow = useShowStore((s) => s.setCurrentShow);

  const [relatedShows, setRelatedShows] = useState([]);

  const [loading, setLoading] = useState({ main: true, related: true });
  const [errMsg, setErrMsg] = useState({ main: null, related: null });

  const [modalData, setModalData] = useState({ isOpen: false, type: "" });
  const [scrollY, setScrollY] = useState(true);
  const [currentUserRate, setCurrentUserRate] = useState(null);
  function handleModal(state, type) {
    setScrollY(false);
    setModalData((prev) => ({ ...prev, isOpen: state, type: type ?? "" }));
  }

  async function getShow() {
    setLoading((prev) => ({ ...prev, main: true }));
    try {
      const response = await axios.get(`/shows/one-show/${id}`);
      setCurrentShow(response.data.showsData);
      setErrMsg((msg) => ({ ...msg, main: null }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrMsg((msg) => ({
          ...msg,
          main: error.response.data.message ?? error.message,
        }));
      } else {
        setErrMsg((msg) => ({ ...msg, main: "Unexpected error!" }));
      }
    }
    setLoading((prev) => ({ ...prev, main: false }));
  }

  async function getRelatedShows() {
    setLoading((prev) => ({ ...prev, related: true }));
    const genres =
      currentShow?.genre.length > 0 ? currentShow.genre.join(",") : [];

    try {
      const response = await axios.get(
        `http://localhost:5000/api/shows/filtered?limit=10&except=${id}&genre=${genres}`
      );
      setRelatedShows(response.data.showsData);
      setErrMsg((msg) => ({ ...msg, related: null }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrMsg((msg) => ({
          ...msg,
          related: error.response.data.message ?? error.message,
        }));
      } else {
        setErrMsg((msg) => ({ ...msg, related: "Unexpected error!" }));
      }
    }
    setLoading((prev) => ({ ...prev, related: false }));
  }

  async function getCurrentUserRate() {
    try {
      const response = await api.get(`/shows/user-rate/${id}`);
      setCurrentUserRate(response.data.currentRate);
    } catch (error) {
      if (
        error.response?.data?.message &&
        error.response?.data?.message === "No rates found!"
      ) {
        return;
      } else {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if (!modalData.isOpen) getShow();
  }, [currentUserRate, modalData, id]);

  useEffect(() => {
    getRelatedShows();
  }, [currentShow]);

  useEffect(() => {
    getCurrentUserRate();
  }, []);

  return (
    <div className={`${!scrollY ? "h-[95vh] overflow-hidden" : ""}`}>
      <div className="mt-4 flex flex-col lg:flex-row">
        <div className=" w-full  lg:w-[70%]">
          {errMsg.main ? (
            <p>{errMsg.main}</p>
          ) : (
            <div>
              {!loading.main ? (
                <DetailsCard handleModal={handleModal} show={currentShow} />
              ) : (
                <h1>Loading..</h1>
              )}
            </div>
          )}
        </div>
        <div className=" bg-secondary/50 p-4 rounded-lg w-full lg:w-[30%] ml-auto backdrop-blur-xs">
          <CommentSection />
        </div>
      </div>
      <div className="mt-6">
        <div className="p-6">
          <p className="text-2xl font-extrabold">Related Shows:</p>
        </div>
        <div className="flex flex-wrap gap-12 p-6 justify-center mt-6  ">
          {loading.related ? (
            <NoShowsFound msg="Loading..." />
          ) : errMsg.related ? (
            <NoShowsFound msg={errMsg.related} />
          ) : relatedShows.length === 0 ? (
            <div className="text-center mt-6">
              {" "}
              <p>No shows found</p>{" "}
            </div>
          ) : (
            <>
              {relatedShows.map((rShow) => (
                <ShowCard key={rShow._id} show={rShow} />
              ))}
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {modalData.isOpen && (
          <ShowModal
            modalType={modalData.type}
            setModalData={setModalData}
            show={currentShow}
            userRate={currentUserRate}
            setCurrentUserRate={setCurrentUserRate}
            token={token}
            setScrollY={setScrollY}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ShowDetails;
