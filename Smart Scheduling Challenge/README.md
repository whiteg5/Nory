# Smart Scheduling Challenge

## Problem Statement

Staffing costs are the largest variable expense for a restaurant, typically accounting for 30-40% of revenue. Properly deployed staffing should enhance service and throughput, while improper staffing—whether overstaffing or understaffing—can harm profitability and customer experience.

Restaurant teams create schedules weekly, often without the tools or data to accurately forecast demand or determine optimal staffing levels. Nory aims to solve this by providing data-driven staffing recommendations to increase productivity, measured by Orders per Labour Hour (OPLH) and Sales per Labour Hour (SPLH).

## Challenge

The challenge involved three tasks:

1. **Demand Forecasting**: Predict hourly order volumes for the first week of July based on historical data.
2. **Optimal Staffing**: Determine the best staffing levels for each predicted order count, based on historical performance.
3. **Staff Scheduling**: Generate a staff schedule for the target week, aligned with forecasted demand and optimal staffing configurations.

## Solution Overview

### Demand Forecasting

Multiple forecasting models were developed and tested to predict hourly orders for the target week. These models included traditional time series approaches like ARIMA and SARIMAX, machine learning models such as XGBoost and Random Forest, and advanced techniques like LSTM networks and Transformer models.

Each model was evaluated based on performance metrics including Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE). The best-performing model was selected to forecast demand for the target week.

### Optimal Staffing

The optimal staffing configuration was determined by mapping each forecasted order count to the historical staffing configurations that yielded the best productivity metrics. The solution ensured that staffing levels met minimum requirements based on hour and day of the week to allow for set up and closing
down, and calculated OPLH to assess productivity.

### Staff Scheduling

The final staff schedule was generated using the demand forecast from the best-performing model. The schedule was designed to meet predicted demand while ensuring productivity and compliance with staffing constraints. The schedule was outputted as an Excel file, for easy review and implementation.

## How to Use the Solution

1. **Dependencies**: Install the necessary libraries and dependencies from the Pipfile.
2. **Data Loading**: Load the input data into the solution.
3. **Execution**: Run the solution to generate the demand forecast and corresponding staff schedule.
4. **Output**: Review the generated staff schedule in the Excel file, which provides a detailed, hour-by-hour staffing plan for the target week.
