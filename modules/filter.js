import _ from 'lodash'
import moment from 'moment'

export default (profiles, user, swipedProfiles) => {

  console.log('profiles:', profiles)
  const rejectMe = _.reject(profiles, profile => {
    if (profile == null) return true
    else return profile.uid == user.uid
  })
  // const rejectMe = false

  const filterGender = _.filter(rejectMe, profile => {
    const userShowMen = user.showMen && profile.gender === 'male'
    const userShowWomen = user.showWomen && profile.gender === 'female'

    const profileShowMen = profile.showMen && user.gender === 'male'
    const profileShowWomen = profile.showWomen && user.gender === 'female'

    return (userShowMen || userShowWomen) && (profileShowMen || profileShowWomen)
    // return (userShowMen || userShowWomen)
  })

  const userBirthday = moment(user.birthday, 'MM/DD/YYYY')
  const userAge = moment().diff(userBirthday, 'years')

  console.log('userAge - ',userAge)

  const filterAgeRange = _.filter(filterGender, profile => {
    const profileBirthday = moment(profile.birthday, 'MM/DD/YYYY')
    const profileAge = moment().diff(profileBirthday, 'years')

    const withinRangeUser = _.inRange(profileAge, user.ageRange[0], user.ageRange[1] + 1)
    const withinRangeProfile = _.inRange(userAge, profile.ageRange[0], profile.ageRange[1] + 1)

    return withinRangeUser && withinRangeProfile
    // return withinRangeUser
  })

  
  const filtered = _.uniqBy(filterAgeRange, 'uid')

  const filterSwiped = _.filter(filtered, profile => {
    const swiped = profile.uid in swipedProfiles
    return !swiped
  })

  return filterSwiped
}
