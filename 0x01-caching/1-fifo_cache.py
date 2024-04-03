#!/usr/bin/env python3
"""
inherits from BaseCaching and is a caching system
"""

from threading import RLock
BaseCaching = __import__('base_caching').BaseCaching
from base_caching import BaseCaching
from collections import OrderedDict


class FIFOCache(BaseCaching):
    """
    A class that inherits from
    `BaseCaching` and is a caching system.
    """

    def __init__(self):
        """ Instantiation method, sets instance attributes
        """
        super().__init__()
        self.__keys = []
        self.__rlock = RLock()

    def put(self, key, item):
        """
        assign to the dictionary `self.cache_data` the
        `item` value for the key `key`
        """

        if key is not None and item is not None:
            _key = self._balance(key)
        with self.__rlock:
            self.cache_data.update({key: item})
        if _key is not None:
            print('DISCARD: {}'.format(_key))

    def get(self, key):
        """
        returns the value in `self.cache_data` linked to `key`
        """

        with self.__rlock:
            return self.cache_data.get(key, None)


    def _balance(self, keyIn):
        """ Removes the oldest item from the cache at MAX size
        """
        _key = None
        with self.__rlock:
            if keyIn not in self.__keys:
                keysLength = len(self.__keys)
                if len(self.cache_data) == BaseCaching.MAX_ITEMS:
                    _key = self.__keys.pop(0)
                    self.cache_data.pop(_key)
                self.__keys.insert(keysLength, keyIn)
