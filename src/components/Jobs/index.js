import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationsList = [
  {
    locationId: 'Hyderabad',
    label: 'Hyderabad',
  },
  {
    locationId: 'Bangalore',
    label: 'Bangalore',
  },
  {
    locationId: 'Chennai',
    label: 'Chennai',
  },
  {
    locationId: 'Delhi',
    label: 'Delhi',
  },
  {
    locationId: 'Mumbai',
    label: 'Mumbai',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: {},
    jobsList: [],
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    searchInput: '',
    employmentTypes: [],
    salaryRange: '',
    locations: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getProfileDetails = async () => {
    this.setState({
      profileApiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/profile'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        profileApiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobs = async () => {
    this.setState({
      jobsApiStatus: apiStatusConstants.inProgress,
    })

    const {employmentTypes, salaryRange, searchInput, locations} = this.state

    const employmentType = employmentTypes.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchInput}`

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedJobsList = data.jobs
        .map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          packagePerAnnum: eachJob.package_per_annum,
          rating: eachJob.rating,
          title: eachJob.title,
        }))
        .filter(eachJob => {
          if (locations.length === 0) {
            return true
          }

          return locations.includes(eachJob.location)
        })

      this.setState({
        jobsList: updatedJobsList,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        jobsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onChangeEmploymentType = event => {
    const {employmentTypes} = this.state

    if (employmentTypes.includes(event.target.value)) {
      this.setState(
        {
          employmentTypes: employmentTypes.filter(
            eachItem => eachItem !== event.target.value,
          ),
        },
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          employmentTypes: [...prevState.employmentTypes, event.target.value],
        }),
        this.getJobs,
      )
    }
  }

  onChangeSalaryRange = event => {
    this.setState(
      {
        salaryRange: event.target.value,
      },
      this.getJobs,
    )
  }

  onChangeLocation = event => {
    const {locations} = this.state

    if (locations.includes(event.target.value)) {
      this.setState(
        {
          locations: locations.filter(
            eachLocation => eachLocation !== event.target.value,
          ),
        },
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          locations: [...prevState.locations, event.target.value],
        }),
        this.getJobs,
      )
    }
  }

  renderProfileSuccessView = () => {
    const {profileData} = this.state

    return (
      <div className='profile-container'>
        <img
          src={profileData.profileImageUrl}
          alt='profile'
          className='profile-image'
        />

        <h1 className='profile-name'>{profileData.name}</h1>

        <p className='profile-bio'>{profileData.shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className='profile-failure-container'>
      <button
        type='button'
        className='retry-button'
        onClick={this.getProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  renderProfileLoader = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#ffffff' height='50' width='50' />
    </div>
  )

  renderProfileSection = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()

      case apiStatusConstants.failure:
        return this.renderProfileFailureView()

      case apiStatusConstants.inProgress:
        return this.renderProfileLoader()

      default:
        return null
    }
  }

  renderNoJobsView = () => (
    <div className='no-jobs-container'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
        alt='no jobs'
        className='no-jobs-image'
      />

      <h1 className='no-jobs-heading'>No Jobs Found</h1>

      <p className='no-jobs-description'>
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return this.renderNoJobsView()
    }

    return (
      <ul className='jobs-list'>
        {jobsList.map(eachJob => (
          <JobItem key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    )
  }

  renderJobsFailureView = () => (
    <div className='jobs-failure-container'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
        alt='failure view'
        className='failure-image'
      />

      <h1 className='failure-heading'>Oops! Something Went Wrong</h1>

      <p className='failure-description'>
        We cannot seem to find the page you are looking for.
      </p>

      <button type='button' className='retry-button' onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsLoader = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#ffffff' height='50' width='50' />
    </div>
  )

  renderJobsSection = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()

      case apiStatusConstants.failure:
        return this.renderJobsFailureView()

      case apiStatusConstants.inProgress:
        return this.renderJobsLoader()

      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />

        <div className='jobs-container'>
          <div className='filters-container'>
            {this.renderProfileSection()}

            <hr className='separator' />

            <div className='employment-container'>
              <h1 className='filter-heading'>Type of Employment</h1>

              <ul className='filters-list'>
                {employmentTypesList.map(eachType => (
                  <li key={eachType.employmentTypeId} className='filter-item'>
                    <input
                      type='checkbox'
                      id={eachType.employmentTypeId}
                      value={eachType.employmentTypeId}
                      onChange={this.onChangeEmploymentType}
                    />

                    <label htmlFor={eachType.employmentTypeId}>
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <hr className='separator' />

            <div className='salary-container'>
              <h1 className='filter-heading'>Salary Range</h1>

              <ul className='filters-list'>
                {salaryRangesList.map(eachSalary => (
                  <li key={eachSalary.salaryRangeId} className='filter-item'>
                    <input
                      type='radio'
                      name='salary'
                      id={eachSalary.salaryRangeId}
                      value={eachSalary.salaryRangeId}
                      onChange={this.onChangeSalaryRange}
                    />

                    <label htmlFor={eachSalary.salaryRangeId}>
                      {eachSalary.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <hr className='separator' />

            <div className='location-container'>
              <h1 className='filter-heading'>Location</h1>

              <ul className='filters-list'>
                {locationsList.map(eachLocation => (
                  <li key={eachLocation.locationId} className='filter-item'>
                    <input
                      type='checkbox'
                      id={eachLocation.locationId}
                      value={eachLocation.locationId}
                      onChange={this.onChangeLocation}
                    />

                    <label htmlFor={eachLocation.locationId}>
                      {eachLocation.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className='jobs-content-container'>
            <div className='search-input-container'>
              <input
                type='search'
                className='search-input'
                placeholder='Search'
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />

              <button
                type='button'
                data-testid='searchButton'
                className='search-button'
                onClick={this.onClickSearch}
              >
                <BsSearch className='search-icon' />
              </button>
            </div>

            {this.renderJobsSection()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
