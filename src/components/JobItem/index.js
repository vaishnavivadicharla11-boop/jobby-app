import {Link} from 'react-router-dom'

const JobItem = props => {
  const {jobDetails} = props

  const {
    id,
    title,
    companyLogoUrl,
    employmentType,
    jobDescription,
    packagePerAnnum,
    rating,
    location,
  } = jobDetails

  return (
    <li>
      <Link to={`/jobs/${id}`}>
        <img src={companyLogoUrl} alt="company logo" />

        <h1>{title}</h1>

        <p>{rating}</p>

        <p>{location}</p>

        <p>{employmentType}</p>

        <p>{packagePerAnnum}</p>

        <h1>Description</h1>

        <p>{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
