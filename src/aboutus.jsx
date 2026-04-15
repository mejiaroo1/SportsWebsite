import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="aboutpage">

      <Navbar />

      <main className="about-content">
        
        <h2>Project Purpose</h2>
        <p>
          Many sports analytics websites provide good data but have dull interfaces 
          that make insights harder to understand and less enjoyable to explore. 
          Our purpose is to redesign that experience by building a clean, visually 
          engaging analytics site that helps users quickly understand game results, 
          player performance, and team trends across pro and college sports.
        </p>

        <h2>Team Skills</h2>
        <ul>
          <li>
            <strong>Front-end development (HTML/CSS/JavaScript, React, UI/UX design):</strong><br />
            Roydon Hampton & Advait Wudali
          </li>
          <li>
            <strong>Back-end/Data handling/API integration:</strong><br />
            Michael Moyo & Oscar Mejia Rodriguez
          </li>
          <li>
            <strong>Project management + version control:</strong><br />
            Git/GitHub, documentation – Michael, Roydon, Oscar & Advait
          </li>
        </ul>

        <h2>Team Members’ Roles</h2>
        <ul>
          <li>
            <strong>Oscar – Project Manager / Scrum Lead:</strong> Keeps timeline, assigns tasks, runs weekly check-ins, coordinates submissions.
          </li>
          <li>
            <strong>Roydon – Front-End Lead (UI/UX):</strong> Layout, navigation, styling system, responsive pages, design consistency.
          </li>
          <li>
            <strong>Oscar – API/Data Lead:</strong> Selects APIs, builds data-fetching layer, normalizes responses, handles edge cases.
          </li>
          <li>
            <strong>Advait – Visualization/Analytics Lead:</strong> Charts, comparisons, dashboard metrics, filters and data presentation.
          </li>
          <li>
            <strong>Michael – Back-End/Integration + Deployment:</strong> API key security/caching, connects front-end to services, deploys to Vercel.
          </li>
        </ul>

        <h2>Resources</h2>
        <p>
          Sports Data API Documentation:
          <br />
          <a
            href="https://www.thesportsdb.com/documentation"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.thesportsdb.com/documentation
          </a>
        </p>

      </main>
    </div>
  );
}