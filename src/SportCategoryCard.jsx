import { Link } from "react-router-dom";
import "./sports-page.css";

function SportCategoryCard({ title, id, description }) {
  return (
    <Link to={`/league/${id}`} className="sport-link-card">
      <div>
        <h2 className="sport-card-title">{title}</h2>
        <p className="sport-card-desc">{description}</p>
      </div>
    </Link>
  );
}

export default SportCategoryCard;