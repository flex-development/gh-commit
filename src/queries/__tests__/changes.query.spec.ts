/**
 * @file Unit Tests - ChangesQuery
 * @module commit-action/queries/tests/unit/ChangesQuery
 */

import TestSubject from '../changes.query'

describe('unit:queries/ChangesQuery', () => {
  describe('constructor', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject()
    })

    it('should set #files', () => {
      expect(subject).to.have.deep.property('files', [])
    })

    it('should set #workspace', () => {
      expect(subject).to.have.property('workspace', process.cwd())
    })
  })
})
