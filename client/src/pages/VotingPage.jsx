import React, { useState } from "react";
import style from "../styles/VotingPage.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const VotingPage = () => {
  const [data, setData] = useState({
    name: "",
    voting_choice: "",
  });

  const navigate = useNavigate();
  const voteHandler = async () => {
    if (!data.name || data.voting_choice === "") {
      alert("Name and Voting choice are required to VOTE");
      return;
    }
    try {
      const postData = await axios.post(`https://votepoling.onrender.com/userInfo`, data);
      if (postData.status === 200) {
        postData.data.message && alert(postData.data.message);
        navigate("/stat");
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response?.data?.message
        alert(errorMsg)
      }
    }
  };

  return (
    <div className={style.parent}>
      <div className={style.voting}>
        <div className={style.inputFields}>
          <div className={style.header}>
            <h1>Vote here</h1>
          </div>
          <div className={style.nameInput}>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div className={style.votingChoiceHeader}>
            <h3>Voting choice</h3>
          </div>
          <div className={style.checkBoxes}>
            <div className={style.trueCheckBox}>
              <input
                id="true"
                type="radio"
                checked={data.voting_choice === true}
                onChange={() => setData({ ...data, voting_choice: true })}
              />
              <label htmlFor="true">Yes</label>
            </div>
            <div className={style.falseCheckBox}>
              <input
                id="false"
                type="radio"
                checked={data.voting_choice === false}
                onChange={() => setData({ ...data, voting_choice: false })}
              />
              <label htmlFor="false">No</label>
            </div>
          </div>
          <div className={style.date}>
            <h3>Date of vote casting</h3>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
          <div className={style.vote_btn}>
            <button className={style.vote_button} onClick={voteHandler}>VOTE</button>
            <button className={style.navStat}  onClick={() => navigate("/stat")} >Visit to STAT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
