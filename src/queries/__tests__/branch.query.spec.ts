/**
 * @file Unit Tests - BranchQuery
 * @module commit-action/queries/tests/unit/BranchQuery
 */

import TestSubject from '../branch.query'

describe('unit:queries/BranchQuery', () => {
  describe('constructor', () => {
    let owner: string
    let ref: string
    let repo: string
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject({
        owner: owner = 'flex-development',
        ref: ref = 'refs/heads/main',
        repo: repo = 'commit-action'
      })
    })

    it('should set #owner', () => {
      expect(subject).to.have.property('owner', owner)
    })

    it('should set #ref', () => {
      expect(subject).to.have.property('ref', ref)
    })

    it('should set qualified #ref', () => {
      // Arrange
      const ref: string = 'main'
      const subject: TestSubject = new TestSubject({ owner, ref, repo })

      // Act + Expect
      expect(subject).to.have.property('ref', 'refs/heads/' + ref)
    })

    it('should set #repo', () => {
      expect(subject).to.have.property('repo', repo)
    })
  })
})
