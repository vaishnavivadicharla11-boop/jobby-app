import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    skills: [],
    lifeAtCompany: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {id} = match.params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    const data = await response.json()

    if (response.ok === true) {
      const updatedJobDetails = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }

      const updatedSkills = data.job_details.skills.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))

      const updatedLifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }

      const updatedSimilarJobs = data.similar_jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobDetails: updatedJobDetails,
        skills: updatedSkills,
        lifeAtCompany: updatedLifeAtCompany,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for</p>

      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, skills, lifeAtCompany, similarJobs} = this.state

    return (
      <div className="job-item-details-container">
        <div className="job-details-card">
          <div className="company-logo-title-container">
            <img
              src={jobDetails.companyLogoUrl}
              alt="job details company logo"
            />

            <div>
              <h1>{jobDetails.title}</h1>

              <p>{jobDetails.rating}</p>
            </div>
          </div>

          <div className="location-package-container">
            <div>
              <p>{jobDetails.location}</p>

              <p>{jobDetails.employmentType}</p>
            </div>

            <p>{jobDetails.packagePerAnnum}</p>
          </div>

          <hr />

          <div className="description-visit-container">
            <h1>Description</h1>

            <a
              href={jobDetails.companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visit
            </a>
          </div>

          <p>{jobDetails.jobDescription}</p>

          <h1>Skills</h1>

          <ul className="skills-list">
            {skills.map(eachSkill => (
              <li key={eachSkill.name} className="skill-item">
                <img src={eachSkill.imageUrl} alt={eachSkill.name} />

                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>

          <h1>Life at Company</h1>

          <div className="life-at-company-container">
            <p>{lifeAtCompany.description}</p>

            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>

        <h1>Similar Jobs</h1>

        <ul className="similar-jobs-list">
          {similarJobs.map(eachJob => (
            <SimilarJobItem key={eachJob.id} similarJobDetails={eachJob} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.inProgress:
        return this.renderLoaderView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />

        {this.renderJobDetails()}
      </>
    )
  }
}
export default JobItemDetails
