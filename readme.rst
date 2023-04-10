Network Performance Framework Web Extension
===========================================

This repository is an extension to NPF
(https://github.com/tbarbette/npf) and should therefore not be used as a
standalone tool as the architecture has been built based on npf's
internal architecture.

However for more advanced usage, it can be used as a standalone tool. In
order to do so, the app has to be initialized by running the following
javascript command:

.. code:: js

   window.updateConfiguration(configuration);

where ``configuration`` follows the type specified inside
``src/utils/data.ts``.

Available Scripts
-----------------

``npm start``
~~~~~~~~~~~~~

Runs the app in development mode available at address
``http://localhost:3000``

``npm test``
~~~~~~~~~~~~

Will be updated later

``npm run build``
~~~~~~~~~~~~~~~~~

Builds the app for production and optimizes it.

``npm run eject`` -- DO NOT USE
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Note: this is a one-way operation. Once you ``eject``, you can’t go
back!** This will be removed in the near future

Releases
--------

-  V0.2

   -  Inlining all app source codes into a single html file instead of external scripts

-  V0.1.1

   -  PyPi package creation and publishing

-  V0.1

   -  Github actions automatic releases
