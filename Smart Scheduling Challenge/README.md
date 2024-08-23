# Smart Scheduling Challenge

## Problem Statement

Staffing costs are the largest variable cost for a restaurant business. Usually in the region of 30-40% of revenue. 

Deployed effectively staffing should be an asset to delivery great, efficient service and have a high throughput. Deployed in-effectively over staffing can drive a business into negative profitability and understaffing can drastically impact guest experience and staff morale.

Front line restaurant teams create weekly/daily schedules which determine what staff should work when in a week. Ideally this should be based on the expected demand of each day and each hour/30 min slot within a day. 

Unfortunately these teams don’t have the tools or the technical proficiency to (a) accurate determine their predicted revenue/order demand and (b) map the expected demand to an optimal number of staff per department. 

This is where Nory comes in - we want to suggest the optimal number of staff for a given level of expected demand - our objective is to make staffing data based and to increase productivity for our customers. For reference we measure productivity using 2 metrics - Orders per labour hour (OPLH) and Sales per labour hour (SPLH). 

A successful outcome will not only save restaurant team’s time but increase these metrics.

Challenge:
Using the input data provided, please:

1. Create a demand forecasting model to predict hourly order data for the week after the data set finishes (i.e. 1st week of July - 1-7th (Mon to Sunday))
2. Backtest the data to determine the optimal level of staff per hour for a given level of orders 
3. Use your demand forecasting model and optimal staffing data to recommend / create a staff schedule for the week 1-7th of July

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
