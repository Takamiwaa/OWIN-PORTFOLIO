import { useState } from "react";
import experienceData from "../data/experinceData.jsx";
import Tippy from '@tippyjs/react';
import Swal from 'sweetalert2';
import 'tippy.js/dist/tippy.css';

const Experience = () => {
  const [activeTab, setActiveTab] = useState("Work");
  const [currentPage, setCurrentPage] = useState(1);
  const experiencesPerPage = 6;

  const filteredExperiences = experienceData.experiences.filter(
    experience => experience.tab.toLowerCase() === activeTab.toLowerCase()
  );

  const totalExperiences = filteredExperiences.length;
  const totalPages = Math.ceil(totalExperiences / experiencesPerPage);
  const startIndex = (currentPage - 1) * experiencesPerPage;
  const endIndex = startIndex + experiencesPerPage; // PERBAIKAN: 'experiencesPerpage' → 'experiencesPerPage'
  const currentExperiences = filteredExperiences.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDetailsClick = (url) => {
    Swal.fire({
      title: "View Details?",
      text: "You will be redirected to the details page.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#666666",
      confirmButtonText: "Yes, view details",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'bg-black/90 backdrop-blur-sm border border-white/20',
        title: 'text-white',
        htmlContainer: 'text-white/80',
        confirmButton: 'bg-white text-black border border-white hover:bg-gray-200',
        cancelButton: 'bg-black/50 text-white border border-white/30 hover:bg-white/10'
      }
    }).then((result) => {
      if (result.isConfirmed && url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else if (!url) {
        Swal.fire({
          title: "No Details Available",
          text: "Details for this experience are not available yet.",
          icon: "info",
          confirmButtonColor: "#000000",
          confirmButtonText: "OK",
          customClass: {
            popup: 'bg-black/90 backdrop-blur-sm border border-white/20',
            title: 'text-white',
            htmlContainer: 'text-white/80',
            confirmButton: 'bg-white text-black border border-white hover:bg-gray-200'
          }
        });
      }
    });
  };

  const handleCompanyClick = (url) => {
    Swal.fire({
      title: "Visit Company?",
      text: "You will be redirected to the company website.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#666666",
      confirmButtonText: "Yes, visit company",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'bg-black/90 backdrop-blur-sm border border-white/20',
        title: 'text-white',
        htmlContainer: 'text-white/80',
        confirmButton: 'bg-white text-black border border-white hover:bg-gray-200',
        cancelButton: 'bg-black/50 text-white border border-white/30 hover:bg-white/10'
      }
    }).then((result) => {
      if (result.isConfirmed && url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else if (!url) {
        Swal.fire({
          title: "No Company Link Available",
          text: "The company website is not available yet.",
          icon: "info",
          confirmButtonColor: "#000000",
          confirmButtonText: "OK",
          customClass: {
            popup: 'bg-black/90 backdrop-blur-sm border border-white/20',
            title: 'text-white',
            htmlContainer: 'text-white/80',
            confirmButton: 'bg-white text-black border border-white hover:bg-gray-200'
          }
        });
      }
    });
  };

  return (
    <section id="experience" className="min-h-screen pt-20 overflow-hidden relative" data-aos-duration="1000" data-aos="fade-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12" data-aos-delay="600" data-aos="fade-down">
          <h2 className="text-5xl font-bold text-white mb-2">{experienceData.title}</h2>
          <p className="text-lg text-white/80">{experienceData.subtitle}</p>
        </div>

        <div className="flex justify-center mb-8 gap-4 flex-wrap" data-aos-delay="600" data-aos="fade-down">
          {experienceData.tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 border border-white/20 ${
                activeTab === tab
                  ? "bg-white text-black shadow-lg"
                  : "bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className={`bx bx-${tab.toLowerCase() === "work" ? "briefcase" : "group"}`}></i>
              {tab}
            </button>
          ))}
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No experiences found for {activeTab} tab</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 gap-6" data-aos-delay="600" data-aos="fade-down">
              {currentExperiences.map((experience, index) => (
                <div
                  key={index}
                  className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:border-white/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 flex items-center justify-center shadow-lg rounded-lg bg-black/50 border border-white/20 text-white shrink-0">
                      <i className={`bx ${experience.icon} text-3xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{experience.title}</h3>
                      <p className="text-sm text-white/70 mb-1">{experience.company}</p>
                      <p className="text-sm text-white/50 mb-4">{experience.year} • {experience.location}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Responsibilities:</h4>
                    <ul className="text-sm text-white/80 space-y-2">
                      {experience.description.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <i className="bx bx-check text-lg text-white"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.tech.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-white/10 text-white/90 text-xs rounded-full border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {experience.details && (
                      <Tippy 
                        content="View Details" 
                        placement="top"
                        animation="shift-away"
                      >
                        <button
                          onClick={() => handleDetailsClick(experience.details)}
                          className={`px-4 py-2 bg-white text-black rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-200 border border-white ${
                            experience.details && experience.companyUrl ? 'w-[70%]' : 'w-full'
                          }`}
                        >
                          Details
                          <i className="bx bx-link-external"></i>
                        </button>
                      </Tippy>
                    )}
                    {experience.companyUrl && (
                      <Tippy 
                        content="Visit Company" 
                        placement="top"
                        animation="shift-away"
                      >
                        <button
                          onClick={() => handleCompanyClick(experience.companyUrl)}
                          className={`px-4 py-2 bg-black/50 text-white border border-white/30 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/10 hover:border-white/50 ${
                            experience.details && experience.companyUrl ? 'w-[30%]' : 'w-full'
                          }`}
                        >
                          Company
                          <i className="bx bx-building"></i>
                        </button>
                      </Tippy>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2" data-aos-delay="600" data-aos="fade-down">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
                    currentPage === 1
                      ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                      : "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30"
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
                      currentPage === page
                        ? "border-white bg-white text-black"
                        : "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
                    currentPage === totalPages
                      ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                      : "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Experience;