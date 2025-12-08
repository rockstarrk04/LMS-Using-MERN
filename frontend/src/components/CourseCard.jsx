import React from "react";
import { Link } from "react-router-dom";

function CourseCard({ course }) {
  // Use Unsplash for a dynamic, relevant thumbnail if one isn't provided.
  const thumbnailUrl = course.thumbnail || `https://source.unsplash.com/400x225/?${encodeURIComponent(course.title)}`;

  return (
    <Link
      to={`/course/${course._id}`}
      className="group block overflow-hidden rounded-lg border border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10"
    >
      <img
        src={thumbnailUrl}
        alt={`${course.title} thumbnail`}
        className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white">{course.title}</h3>
        <p className="mt-2 text-sm text-slate-400">{course.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-400">${course.price}</span>
          <span className="text-sm text-slate-400">By {course.instructor?.name || 'Instructor'}</span>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;