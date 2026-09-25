const SimilarJobItem = props => {
  const {similarJobDetails} = props

  const {
    title,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
  } = similarJobDetails

  return (
    <li className="similar-job-item">
      <div className="logo-title-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-job-logo"
        />

        <div>
          <h1>{title}</h1>

          <p>{rating}</p>
        </div>
      </div>

      <h1>Description</h1>

      <p>{jobDescription}</p>

      <div className="location-type-container">
        <p>{location}</p>

        <p>{employmentType}</p>
      </div>
    </li>
  )
}

export default SimilarJobItem
