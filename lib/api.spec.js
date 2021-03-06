const api = require('./api');

describe('api', () => {
  describe('is()', () => {
    it('return boolean isValid', () => {
      const env = {
        validate: a => a === 'a' ? undefined : 'error',
      };

      expect(api.is(env, 'a', null)).toEqual(true);
      expect(api.is(env, 'b', null)).toEqual(false);
    });
  });

  describe('not()', () => {
    it('return boolean isNotValid', () => {
      const env = {
        validate: a => a === 'a' ? undefined : 'error',
      };

      expect(api.not(env, 'a', null)).toEqual(false);
      expect(api.not(env, 'b', null)).toEqual(true);
    });
  });

  describe('find()', () => {
    const env = {
      validate: (path, instance) => path === instance ? undefined : 'error',
    };

    it('implements switch strategy for object and returns value by key', () => {
      const references = {
        '#/common': 1,
        '#/other': 2,
      };

      expect(
        api.find(
          env,
          references,
          '#/common'
        )
      ).toEqual(1);

      expect(
        api.find(
          env,
          references,
          '#/other'
        )
      ).toEqual(2);

      expect(
        api.find(
          env,
          references,
          '#/noname'
        )
      ).toEqual(undefined);
    });

    it('implements switch strategy for array and returns array index or undefined', () => {
      const references = ['#/common', '#/other'];

      expect(
        api.find(
          env,
          references,
          '#/common'
        )
      ).toEqual(0);

      expect(
        api.find(
          env,
          references,
          '#/other'
        )
      ).toEqual(1);

      expect(
        api.find(
          env,
          references,
          '#/noname'
        )
      ).toEqual(undefined);
    });
  });

  describe('filter()', () => {
    const env = {
      validate: (path, instance) => instance === '#/noname' ? 'error' : undefined,
    };

    it('implements filter strategy for object and returns values by key', () => {
      const references = {
        '#/common': 1,
        '#/other': 2,
      };

      expect(
        api.filter(
          env,
          references,
          '#/common'
        )
      ).toEqual([1, 2]);

      expect(
        api.filter(
          env,
          references,
          '#/noname'
        )
      ).toEqual([]);
    });

    it('implements filter strategy for array and returns array index', () => {
      const references = ['#/common', '#/other'];

      expect(
        api.filter(
          env,
          references,
          '#/common'
        )
      ).toEqual([0, 1]);

      expect(
        api.filter(
          env,
          references,
          '#/noname'
        )
      ).toEqual([]);
    });
  });

  describe('match()', () => {
    const references = {
      '#/common': () => 1,
      '#/other': () => 2,
    };
    const env = {
      validate: (path, instance) => path === instance ? undefined : 'error',
    };

    it('executes found reference', () => {
      expect(
        api.match(
          env,
          references,
          '#/common'
        )
      ).toEqual(1);

      expect(
        api.match(
          env,
          references,
          '#/other'
        )
      ).toEqual(2);

      expect(
        api.match(
          env,
          references,
          '#/noname'
        )
      ).toEqual(undefined);
    });

    it('when invoked without instance exposes match function', () => {
      const validate = api.match(env, references);

      expect(validate('#/common')).toEqual(1);
      expect(validate('#/other')).toEqual(2);
    });
  });
});
