import { Link } from "react-router-dom";
import { formatUserFullName, formatDateAndTime } from "../lib/utliles";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../lib/axios-utils";

function PanelActivityTile({ log }) {
  const isDeleted = log.operation === "delete";
  const [logDetails, setLogDetails] = useState(false);

  const [commentDetails, setCommentDetails] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const baseRoute = log.model === "User" ? "/profile" : "/shows";
  async function getCommentDetails(params) {
    setLoading(true);

    try {
      const response = await api.get(
        `/comments/commentDetails?commentId=${log.documentId}`
      );
      setCommentDetails(response.data.commentDetails);
      setErrMsg(null);
      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrMsg(error.response.data.message || error.message);
      } else {
        setErrMsg("Unexpected error");
      }
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (log.model === "Comment" && !isDeleted) {
      getCommentDetails();
    }
  }, [log]);

  return (
    <div className="rounded-md border">
      <div className="flex  items-center px-4 py-1  ">
        <div className="py-4 w-[20%] text-nowrap overflow-x-scroll [&::-webkit-scrollbar]:h-1  [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md transition-all ease-in-out duration-300">
          <Link
            to={`/profile/${log.updatedBy?._id}`}
            title={log.updatedBy?._id ? log.updatedBy?._id : "User deleted"}
          >
            {log.updatedBy?._id
              ? formatUserFullName(log.updatedBy.fullName)
              : "User deleted"}
          </Link>
        </div>
        <div className="w-[20%] ">
          <p>{log.model}</p>
        </div>
        <div className="w-[20%] ">
          <p>{formatUserFullName(log.operation)}</p>
        </div>
        <div className="w-[20%] ">
          <p>{formatDateAndTime(log.createdAt)}</p>
        </div>
        <div className="w-[20%]">
          <button
            type="button"
            onClick={() => setLogDetails(!logDetails)}
            className="p-2 bg-green-900 border rounded-md hover:brightness-125"
          >
            Details
          </button>
        </div>
      </div>
      {logDetails && (
        <div className="px-4 pb-4 space-y-4 mt-4">
          <div>
            {!isDeleted ? (
              log.model !== "Comment" ? (
                <Link
                  to={`${baseRoute}/${log.documentId}`}
                  target="blank"
                  className="p-2 border rounded-lg bg-secondary"
                >
                  Current Doc
                </Link>
              ) : (
                <div>
                  <div className="flex gap-4 items-center justify-center p-4">
                    <p>Author: </p>
                    <p>{formatUserFullName(commentDetails.author.fullName)}</p>
                  </div>
                  <div className="flex gap-4 items-center justify-center p-4">
                    <p>Related Show: </p>
                    <Link
                      to={`/shows/${commentDetails.relatedShow._id}`}
                      className="p-2 border rounded-lg bg-secondary"
                    ></Link>
                  </div>
                </div>
              )
            ) : (
              <p>Deleted</p>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold">Changes:</h2>
            <div className="grid grid-cols-16 gap-4 border p-2 rounded-md bg-secondary mb-2">
              <p className="col-span-1">#</p>
              <p className="col-span-4">Field</p>
              <p className="col-span-7">Old Vlaue</p>
              <p className="col-span-4 justify-self-center">New Vlaue</p>
            </div>
            <div className="flex flex-col gap-2">
              {isDeleted ? (
                <div className="grid grid-cols-16 gap-4 border p-2 rounded-md">
                  <p className="col-span-1">1</p>
                  <p className="col-span-4 scrollx h-fit">
                    Old ID: {log.changes[0].field}
                  </p>
                  <div className="col-span-7 space-y-2">
                    {Object.entries(log.changes[0].oldValue).map(
                      ([key, value]) => (
                        <div key={key} className="flex gap-4">
                          <p>{key}: </p>
                          {Array.isArray(value) ? (
                            <div className="flex gap-2 scrollx text-nowrap">
                              {value.map((val) => (
                                <p>{val}, </p>
                              ))}
                            </div>
                          ) : (
                            <p className="scrollx text-nowrap">{value}</p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                  <p className="col-span-4 justify-self-center scrollx text-nowrap">
                    {log.changes[0].newValue}
                  </p>
                </div>
              ) : (
                <>
                  {log.changes.map((change, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-16 gap-4 p-2 rounded-md ${
                        index % 2 !== 0 ? "bg-gray-500/30" : ""
                      }`}
                    >
                      <p className="col-span-1">{index + 1}</p>
                      <p className="col-span-4">{change.field}</p>
                      {Array.isArray(change.oldValue) ? (
                        <div className="col-span-7 flex gap-2 scrollx text-nowrap">
                          {change.oldValue.map((val) => (
                            <p> {val}, </p>
                          ))}
                        </div>
                      ) : (
                        <p
                          className={`col-span-7 ${
                            change.field !== "description"
                              ? "scrollx text-nowrap"
                              : ""
                          }`}
                        >
                          {change.field === "password"
                            ? "Password"
                            : change.oldValue}
                        </p>
                      )}
                      {Array.isArray(change.newValue) ? (
                        <div className="col-span-4 flex gap-2 justify-self-center">
                          {change.newValue.map((val) => (
                            <p> {val}, </p>
                          ))}
                        </div>
                      ) : (
                        <p
                          className={`col-span-4 w-full justify-self-center border-4 ${
                            change.field !== "description"
                              ? "scrollx text-nowrap"
                              : ""
                          }`}
                        >
                          {change.field === "password"
                            ? "Password"
                            : change.newValue}
                        </p>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelActivityTile;
