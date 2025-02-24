# 📊 Data Visualization for EU Countries

This project is a **data visualization application** that provides interactive graphs and tables for analyzing key economic and demographic indicators of **European Union countries**. The dataset includes **GDP per capita, Life Expectancy, and Population** for the period **2010-2023**.  

The application was developed as part of the **Multimedia** course at the **Faculty of Economic Cybernetics, Statistics and Informatics**.

## 🚀 Features

- **📈 Indicator Evolution Graph**: View the historical trend of **GDP per capita, Life Expectancy, or Population** for a selected country using **SVG-based graphics**.
- **🟢 Bubble Chart**: Compare multiple countries' economic and demographic performance using a **canvas-based bubble chart**.
- **🎥 Animated Bubble Chart**: View how country performance evolves over multiple years through animation.
- **📊 Data Table View**: Display data in a structured table format, where cell colors indicate proximity to the EU average.

## 🖥️ Screenshots

### 📌 Indicator Evolution Graph
<p align="center">
  <img src="https://github.com/user-attachments/assets/d10d00a7-19a0-4356-af31-60dd198f3ce5" width="70%">
</p>


### 🟢 Bubble Chart
<p align="center">
  <img src="https://github.com/user-attachments/assets/e1c215ee-29f7-4a56-a3d7-8fc549d4d131" width="70%">
</p>


### 📊 Data Table View
<p align="center">
  <img src="https://github.com/user-attachments/assets/6ac43342-bebb-4fec-9272-07a07c00904b" width="70%">
</p>

## 🛠️ Technologies Used

- **HTML, CSS, JavaScript** for the frontend
- **SVG** for scalable graphics
- **Canvas API** for raster-based graphics

## 📌 How It Works

1. **Select a country and an indicator** to visualize its historical evolution.
2. **Choose a year** to view a **bubble chart or table** comparing multiple countries.
3. **Run the animation** to see how country rankings evolve over time.

## 📜 Dataset

The dataset is retrieved dynamically from **Eurostat API**. Example API call:
```
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_mlexpec?sex=T&age=Y1&time=2019&geo=RO&geo=BG
```
