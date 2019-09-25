import { ObjectId } from 'bson'

export interface IUser {
  id: ObjectId,
  username: string,
  name: {
    first: string,
    last: string,
  },
  email: string,
  picture: string,
  socialNetworks:{
      facebook: string,
      linkedin: string,
      twitter: string,
      medium: string,
      speakerDeck: string,
      pinterest: string,
      instagram: string,
      others: [{
        name: string,
        link: string 
      }]
  },
  location: {
      coutry: string,
      state: string,
      city: string
  },
  document: string,
  groups: ObjectId[],
  tags: string[],
  services: ObjectId[],
  createdAt: Date | null,
  updatedAt: Date | null,
  deletedAt: Date | null
}
