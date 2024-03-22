import React, { useEffect, useState } from "react";
import style from "../styles/StatisticPage.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios from "axios";

const StatisticPage = () => {
  const [rows, setRows] = useState([]);
  const [bar, setBar] = useState({
    labels: [true, false],
    datasets: [
      { label: "Number of votes", data: [], backgroundColor: ["green", "red"] },
    ],
  });
  const [line, setLine] = useState({
    labels: ["true", "false"],
    datasets: [
      {
        label: "Yes",
        data: "",
        fill: false,
        borderColor: "green",
        tension: 0.1,
      },
      {
        label: "No",
        data: rows
          .filter((item) => item.voting_choice == false)
          .map((item) => item.casted_at),
        fill: false,
        borderColor: "red",
        tension: 0.1,
      },
    ],
  });
  console.log();
  useEffect(() => {
    (async () => {
      try {
        const getData = await axios.get("https://votepoling.onrender.com");
        const transformData = getData.data?.data?.map((rows) => ({
          ...rows,
          voting_choice: rows.voting_choice === 1,
        }));
        setRows(transformData);
        const trueCount = getData.data.votes.filter(
          (item) => item.voting_choice === 1
        );
        const falseCount = getData.data.votes.filter(
          (item) => item.voting_choice === 0
        );

        setBar({
          ...bar,
          datasets: [
            {
              ...bar.datasets[0],
              data: [
                trueCount[0]["COUNT(voting_choice)"],
                falseCount[0]["COUNT(voting_choice)"],
              ],
            },
          ],
        });

        const trueVotes = getData.data.DateTrueVotes.reduce((acc, item) => {
          acc[item.casted_at] = item["COUNT(casted_at)"];
          return acc;
        }, {});
        const falseVotes = getData.data.DateFalseVotes.reduce((acc, item) => {
          acc[item.casted_at] = item["COUNT(casted_at)"];
          return acc;
        }, {});
  
        const dates = [...new Set([...Object.keys(trueVotes), ...Object.keys(falseVotes)])];
        const votesYes = dates.map((date) => trueVotes[date] || 0);
        const votesNo = dates.map((date) => falseVotes[date] || 0);
  

        setLine({
          ...line,
          labels: dates,
          datasets: [
            {
              ...line.datasets[0],
              data: votesYes,
            },
            {
              ...line.datasets[1],
              data: votesNo,
            },
          ],
        });
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    })();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "voting_choice",
      headerName: "Voting Choice",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "casted_at",
      headerName: "Casted On",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <div className={style.parent}>
      <div className={style.table}>
        <div className={style.tableChild}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
      </div>
      <div className={style.chartCotainer}>
        <div className={style.barChartContainer}>
          <div className={style.barHeader}>
            <h1>Bar Chart</h1>
          </div>
          <div className={style.barChart}>
            <Bar data={bar} />
          </div>
        </div>
        <div className={style.lineChartContainer}>
          <div className={style.lineHeader}>
            <h1>Line Chart</h1>
          </div>
          <div className={style.lineChart}>
            <Line data={line} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticPage;
