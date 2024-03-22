import mySql from "mysql2"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

dotenv.config()

const connection = mySql.createPool({
    host: `${process.env.HOST}`,
    user: `${process.env.USER}`,
    password: `${process.env.PASSWORD}`,
    database: `${process.env.DATABASE}`,

}).promise()
app.post("/userInfo", async (req, res) => {
    try {
        const casted_at = new Date().toLocaleDateString()
        const { name, voting_choice } = req.body


        if (name) {
            const [dupeVerification] = await connection.query(`SELECT * FROM votes WHERE name = ?`, [name])
            if (dupeVerification.length) {
                return res.status(409).json({
                    message: `Voting already has been done by ${name}`
                })

            }

            await connection.query(`INSERT INTO votes( name, voting_choice, casted_at  )
        VALUES(?, ?, ?)`, [name, voting_choice, casted_at])


            return res.json({
                message: "User Voting is saved successfully",

            })
        }
        else {
            return res.json({
                message: "bad request"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

app.get("/", async (req, res) => {
    try {

        const [data] = await connection.query(`SELECT * FROM votes`)
        const [votes] = await connection.query(`SELECT voting_choice, COUNT(voting_choice) FROM votes GROUP BY voting_choice`)
        const totalVotes = votes.length && votes.map((item) => item["COUNT(voting_choice)"]).reduce((acc, curr) => acc + curr)
        const [DateTrueVotes] = await connection.query('SELECT casted_at, COUNT(casted_at) FROM votes WHERE voting_choice = 1 GROUP BY casted_at')
        const [DateFalseVotes] = await connection.query('SELECT casted_at, COUNT(casted_at) FROM votes WHERE voting_choice = 0 GROUP BY casted_at')
        return res.json({
            data,
            votes,
            totalVotes,
            DateTrueVotes,
            DateFalseVotes
        })
    } catch (error) {
        console.log(error)
    }
})




// CREATE DATABASE votingpool;
// USE votingpool;
// CREATE TABLE VOTES(
//  id INT NOT NULL AUTO_INCREMENT,
//  name VARCHAR(30) NOT NULL,
//  voting_choice BOOLEAN NOT NULL,
//  casted_at VARCHAR(20) NOT NULL,
//  PRIMARY KEY (id)
// );


app.listen(process.env.PORT || 4001, () => {
    console.log("server running on port 4001")
})
