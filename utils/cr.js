const express = require('express');
const axios = require('axios');
const https = require('https');

const router = express.Router();

// Create an HTTPS agent that ignores SSL certificate errors
// Note: This is needed for the 12306 API which has certificate issues
const agent = new https.Agent({
  rejectUnauthorized: false
});

// Function to fetch train schedule from 12306
async function fetchTrainSchedule(trainDate, fromStation, toStation) {
  try {
    const url = `https://kyfw.12306.cn/otn/leftTicket/queryG?leftTicketDTO.train_date=${trainDate}&leftTicketDTO.from_station=${fromStation}&leftTicketDTO.to_station=${toStation}&purpose_codes=ADULT`;
    const response = await axios.get(url, { httpsAgent: agent });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch train schedule: ${error.message}`);
  }
}

// GET /cr/next-train-to-hk - Get the next train from Shenzhen North to Hong Kong West Kowloon
router.get('/next-train-to-hk', async (req, res) => {
  try {
    // Fetch schedule for Shenzhen North (IOQ) to Hong Kong West Kowloon (XJA)
    const trainData = await fetchTrainSchedule('2025-09-21', 'IOQ', 'XJA');
    
    if (trainData.data.result.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No train information available'
      });
    }
    // Parse the first result
    const firstResult = trainData.data.result[0];
    const parts = firstResult.split('|');
    
    // Extract required information
    const encryptedCode = parts[0];  // 加密码
    const bookingButton = parts[1];  // 预定
    const trainNumber = parts[2];    // 车号
    const trainName = parts[3];      // 车次
    const departureTime = parts[8];  // 出发时刻
    const arrivalTime = parts[9];    // 到达时刻
    const duration = parts[10];      // 历时
    const availability = parts[11];  // 是否可购买
    const secondClassSeat = parts[30]; // 二等座
    
    res.json({
      status: 'success',
      data: {
        encryptedCode,
        bookingButton,
        trainNumber,
        trainName,
        departureTime,
        arrivalTime,
        duration,
        availability,
        secondClassSeat
      },
      message: 'Next train from Shenzhen North to Hong Kong West Kowloon'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;